import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen} = createStackNavigator();

import { Home } from '../screens/Home';
import { CarDetails } from '../screens/CarDetails';
import { Scheduling } from '../screens/Scheduling';
import { SchedulingDetails } from '../screens/SchedulingDetails';
import { Complete } from '../screens/Complete';
import { MyCars } from '../screens/MyCars';



export function AppStackRoutes(){
    return (
        <Navigator 
        screenOptions={{
            headerShown: false,
        }}
        initialRouteName='Home'
        >
            <Screen 
                name="Home"
                component={Home}
            />

            <Screen 
                name="CarDetails"
                component={CarDetails}
            />

            <Screen 
                name="Scheduling"
                component={Scheduling}
            />

            <Screen 
                name="SchedulingDetails"
                component={SchedulingDetails}
            />

            <Screen 
                name="Complete"
                component={Complete}
            />

            <Screen 
                name="MyCars"
                component={MyCars}
            />
        </Navigator>
    )
}