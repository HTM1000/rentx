import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen} = createStackNavigator();

import { Complete } from '../screens/Complete';
import { Splash } from '../screens/Splash';
import { SignIn } from '../screens/SignIn';
import { SignUpFirstStep } from '../screens/SignUp/SignUpFirstStep';
import { SignUpSecondaryStep } from '../screens/SignUp/SignUpSecondaryStep';


export function AuthRoutes(){
    return (
        <Navigator 
        screenOptions={{
            headerShown: false,
        }}
        initialRouteName='Splash'
        >
            <Screen 
                name="Splash"
                component={Splash}
            />
            <Screen 
                name="SignIn"
                component={SignIn}
            />

            <Screen 
                name="SignUpFirstStep"
                component={SignUpFirstStep}
            />

            <Screen 
                name="SignUpSecondaryStep"
                component={SignUpSecondaryStep}
            />
            <Screen 
                name="Complete"
                component={Complete}
            />
        </Navigator>
    )
}