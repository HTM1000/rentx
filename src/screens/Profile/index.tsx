import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'styled-components'
import { BackButton } from '../../components/BackButton';
import { Feather } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { useAuth } from '../../hooks/auth';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';
import { useNetInfo } from '@react-native-community/netinfo'

import {
    Container,
    Header,
    HeaderTop,
    HeaderTitle,
    LogoutButton,
    PhotoContainer,
    Photo,
    PhotoButton,
    Content,
    Option, 
    Options,
    OptionsTitle,
    Section
} from './styles';
import { Button } from '../../components/Button';

export function Profile(){
    const { user, signOut, updateUser } = useAuth();
    const netInfo = useNetInfo();
    const theme = useTheme();
    const navigation = useNavigation();
    const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');
    const [avatar, setAvatar] = useState(user.avatar);
    const [name, setName] = useState(user.name);
    const [driverLicense, setDriverLicense] = useState(user.driver_license);

    function handleBack(){
        navigation.goBack();
    }

    function handleOptions(optionSelected: 'dataEdit' | 'passwordEdit'){
        if(netInfo.isConnected === false && optionSelected === 'passwordEdit'){
            Alert.alert('Voce está offline', 'Para alterar a senha, conecte-se a Internet')
        }else{
        setOption(optionSelected);
        }
    }

    async function handleAvatarSelect(){
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowEdit: true,
            aspect: [4, 4],
            quality: 1,
        });

        if(result.cancelled){
            return;
        }

        if(result.uri){
            setAvatar(result.uri)
        }
    }

    async function handleProfileUpdate(){
        try {
            const schema = Yup.object().shape({
                driverLicense: Yup.string().required('CNH é obrigatória'),
                name: Yup.string().required('Nome é obrigatório')
            });

            const data = { name, driverLicense}
            await schema.validate(data);

            await updateUser({
                id: user.id,
                user_id: user.user_id,
                email: user.email,
                name,
                driver_license: driverLicense,
                avatar,
                token: user.token
            })

            Alert.alert('Perfil atualizado!')

        } catch(e){
            if(e instanceof Yup.ValidationError){
                Alert.alert('Opa', e.message)
            } else {
                Alert.alert('Nao foi possivel atualizar o perfil')
            }
        }
    }

    async function handleSignOut(){
        Alert.alert('Tem certeza?', 'Lembre-se, caso voce saia, irá precisar de internet para retornar', [
            {
                text: 'Cancelar',
                onPress: () => {},
            },
            {
                text: 'Sair',
                onPress: () => signOut()

            }
    ])

        signOut()
    }

    return (
        <KeyboardAvoidingView behavior="position" enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Header>
                        <HeaderTop>
                            <BackButton 
                            color={theme.colors.shape} 
                            onPress={handleBack}
                            />
                            <HeaderTitle>Editar Perfil</HeaderTitle>
                            <LogoutButton onPress={handleSignOut}>
                                <Feather 
                                name="power" 
                                size={24} 
                                color={theme.colors.shape} 
                                />
                            </LogoutButton>
                        </HeaderTop>

                        <PhotoContainer>
                           { !!avatar && <Photo source={{ uri: avatar}} /> }
                            <PhotoButton onPress={handleAvatarSelect}>
                                <Feather 
                                name='camera'
                                size={24}
                                color={theme.colors.shape}
                                />
                            </PhotoButton>
                        </PhotoContainer>
                    </Header> 

                    <Content  style={{ marginBottom: useBottomTabBarHeight() }}>
                        <Options>
                            <Option 
                            active={option === 'dataEdit'} 
                            onPress={() => handleOptions('dataEdit')}
                            >
                                <OptionsTitle active={option === 'dataEdit'}>Dados</OptionsTitle>
                            </Option>
                            <Option 
                            active={option === 'passwordEdit'}
                            onPress={() => handleOptions('passwordEdit')}
                            >
                                <OptionsTitle active={option === 'passwordEdit'}>Trocar Senha</OptionsTitle>
                            </Option>
                        </Options>
                        {
                            option === 'dataEdit' ?
                                <Section>
                                    <Input 
                                        iconName="user"
                                        placeholder="Nome"
                                        autoCorrect={false}
                                        defaultValue={user.name}
                                        onChangeText={setName}
                                    />
                                    <Input 
                                        iconName="mail"
                                        editable={false}
                                        defaultValue={user.email}
                                    />
                                    <Input 
                                        iconName="credit-card"
                                        placeholder="CNH"
                                        keyboardType='numeric'
                                        defaultValue={user.driver_license}
                                        onChangeText={setDriverLicense}
                                    />
                                </Section>
                            :
                                <Section>
                                    <PasswordInput 
                                        iconName="lock"
                                        placeholder="Senha atual"
                                    
                                    />
                                    <PasswordInput 
                                    iconName="lock"
                                    placeholder="Nova senha"
                                    
                                    />
                                    <PasswordInput 
                                        iconName="lock"
                                        placeholder="Repetir senha"
                                    
                                    />
                                </Section>
                        }
                        <Button 
                            title='Salvar Alterações'
                            onPress={handleProfileUpdate}
                        />
                    </Content>
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}