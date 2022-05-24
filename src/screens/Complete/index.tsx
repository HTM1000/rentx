import React from 'react';
import { useWindowDimensions, StatusBar } from 'react-native';

import LogoGraySVG from '../../assets/logo_background_gray.svg';
import DoneSVG from '../../assets/done.svg';

import {
    Container,
    Content,
    Title,
    Message,
    Footer,
} from './styles';
import { ConfirmButton } from '../../components/ConfirmButton';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Params {
    title: string;
    message: string;
    nextScreenRoute: string;
}

export function Complete() {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const route = useRoute();

    const { title, message, nextScreenRoute } = route.params as Params

    function handleConfirme(){
        navigation.navigate(nextScreenRoute)
    }

    return (
        <Container>
             <StatusBar 
                barStyle="light-content"
                backgroundColor="transparent"
                translucent //exclusivo para android. "Retirando" barra superior do telefone 
             />
            <LogoGraySVG 
                width={width}
            />

            <Content>
                <DoneSVG width={80} height={80} />
                <Title>{title}</Title>

                <Message>
                    {message}
                </Message>
            </Content>

            <Footer>
                <ConfirmButton title='OK' onPress={handleConfirme}/>
            </Footer>
        </Container>
    );
}