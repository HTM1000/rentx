import { useNavigation } from '@react-navigation/core';
import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, interpolate, Extrapolate, runOnJS } from 'react-native-reanimated';
import BrandSVG from '../../assets/brand.svg'
import LogoSVG from '../../assets/logo.svg'

import {
    Container,
} from './styles';

export function Splash(){
    const splashAnimation = useSharedValue(0);

    const navigation = useNavigation()

    const brandStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(splashAnimation.value, [0, 50], [1, 0]),
            transform:[ 
                {
                translateX: interpolate(splashAnimation.value, [0, 50], [0, -50], Extrapolate.CLAMP),
                } 
            ]       
        }
    });

    const logoStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(splashAnimation.value, [0, 50], [0, 1]),
            transform:[ 
                {
                translateX: interpolate(splashAnimation.value, [0, 50], [-50, 0], Extrapolate.CLAMP),
                } 
            ] 
        }
    });

    function StartApp(){
        navigation.navigate('SignIn')
    }
    
    useEffect(() => {
        splashAnimation.value = withTiming(
            50,
            { duration: 1000},
            () => {
                'worklet'
                runOnJS(StartApp)();
            }
        )
    }, [])

    return (
        <Container>
            <Animated.View style={[brandStyle, {position: 'absolute'}]}>
                <BrandSVG width={80} height={50} />
            </Animated.View>
            <Animated.View style={[logoStyle, {position: 'absolute'}]}>
                <LogoSVG width={180} height={20} />
            </Animated.View>
        </Container>
    )
}
