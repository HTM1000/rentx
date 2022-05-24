import React from 'react';
import { useTheme } from 'styled-components'; 
import { ActivityIndicator } from 'react-native';
import {
    Container,
    Title,
} from './styles';
import { RectButtonProps } from 'react-native-gesture-handler';

interface Props extends RectButtonProps {
    title: string;
    color?: string; 
    loading?: boolean;
    light?: boolean;
}

export function Button({ 
    title, 
    color, 
    onPress, 
    enabled = true,
    loading = false,
    light = false
} : Props){
    const theme = useTheme();

    return (
        <Container 
        color={color ? color : theme.colors.main} 
        onPress={onPress} 
        enabled={enabled}
        style={{ opacity: (enabled === false || loading === true) ? .5 : 1 }} 
        >
        { 
         loading ? <ActivityIndicator color={theme.colors.shape} /> : <Title light={light}>{title}</Title>
        }
        </Container>
    );
}