import axios from 'axios';
import 
    React, { 
    createContext, 
    useState, 
    useContext, 
    ReactNode,
    useEffect
} from 'react';

import { api } from '../services/api';
import { database } from '../database';
import { User as ModelUser } from '../database/model/User';
interface User {
    id: string;
    user_id: string;
    email: string;
    name: string;
    driver_license: string;
    avatar: string;
    token: string;
}

interface SignInCredencial {
    email: string;
    password: string;
}

interface AuthContextData {
    user: User;
    signIn: (credencials: SignInCredencial) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    load: boolean;
}

interface AuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children } : AuthProviderProps){
    const [data, setData] = useState<User>({} as User);
    const [load, setLoad] = useState(true);
    
    const instance = axios.create({
        baseURL: 'https://api.example.com'
      });

    async function signIn({ email, password } : SignInCredencial){
       
        try {
            const response = await api.post('/sessions', {
                email,
                password,
            });
    
            const { token, user } = response.data;
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 

            const userColletion = database.get<ModelUser>('users');
            await database.write(async () => {
                await userColletion.create(( newUser ) => {
                    newUser.user_id = user.id
                    newUser.name = user.name,
                    newUser.email = user.email,
                    newUser.driver_license = user.driver_license,
                    newUser.avatar = user.avatar,
                    newUser.token = token
                })
            })
    
            setData({ ...user, token });
        } catch (e) {
            throw new Error(e)
        }
    }

    async function signOut(){
        try {
            const userColletion = database.get<ModelUser>('users');
            await database.write(async () => {
                const userSelected = await userColletion.find(data.id);
                await userSelected.destroyPermanently();
            })

            setData({} as User);
        } catch (e) {
            throw new Error(e)
        }
    }

    async function updateUser(user: User) {
        try {
            const userColletion = database.get<ModelUser>('users');
            await database.write(async () => {
                const userSelected = await userColletion.find(user.id);
                await userSelected.update(( userData ) => {
                    userData.name = user.name;
                    userData.driver_license = user.driver_license;
                    userData.avatar = user.avatar;
                });
            });
            
            setData(user);

        } catch (e) {
            throw new Error(e)
        }
    }

    useEffect(() => {
        async function loadUserData(){
            const userColletion = database.get<ModelUser>('users');
            const response = await userColletion.query().fetch();

            if(response.length > 0){
                const userData = response[0]._raw as unknown as User;
                api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`; 
                setData(userData)
            }
        }
    })

    return (
        <AuthContext.Provider 
            value={{
                user: data,
                signIn,
                signOut,
                updateUser,
                load,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
} 

function useAuth(): AuthContextData{
    const context = useContext(AuthContext);
    return context;
}

export { 
    AuthProvider,
    useAuth,
}