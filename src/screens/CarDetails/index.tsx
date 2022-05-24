import React from 'react';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider'; 
import { Acessory } from '../../components/Acessory';
import { Button } from '../../components/Button';
import { getAcessoryIcon } from '../../utils/getAccessoryIcon'
import { useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, Extrapolate, interpolate } from 'react-native-reanimated';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components'

import {
    Container,
    Header,
    CarImages,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Periodo,
    Price,
    About,
    Accessorys,
    Footer,
} from './styles';



interface Params {
    car: CarDTO;
}

export function CarDetails(){
    const navigation = useNavigation();
    const route = useRoute();
    const { car } = route.params as Params;
    const ScrollY = useSharedValue(0);
    const theme = useTheme();

    const ScrollHandler = useAnimatedScrollHandler(event => {
        ScrollY.value = event.contentOffset.y;
    
    })

    const headerStyleAnimation = useAnimatedStyle(() => {
        return {
            height: interpolate(
                ScrollY.value,
                [0, 200],
                [200, 70],
                Extrapolate.CLAMP
            )
        }
    });

    const sliderCarsStyleAnimation = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                ScrollY.value,
                [0, 150],
                [1, 0],
                Extrapolate.CLAMP
            )
        }
    })

    function handleConfirmeRental(){
        navigation.navigate('Scheduling', { car });
    }

    function handleBack(){
        navigation.goBack()
    }

    return (
        <Container>
            <StatusBar 
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />

            <Animated.View
                style={[
                headerStyleAnimation, 
                styles.header,
                { backgroundColor: theme.colors.background_secondary}
            ]}
            >
                <Header>
                    <BackButton onPress={handleBack} />
                </Header>

                
                <Animated.View style={[sliderCarsStyleAnimation]} >
                    <CarImages>
                        <ImageSlider imagesUrl={car.photos} />
                    </CarImages>
                </Animated.View>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: getStatusBarHeight() + 160,
                }}
                showsVerticalScrollIndicator={false}
                onScroll={ScrollHandler}
                scrollEventThrottle={16}
            >
                <Details>
                    <Description>
                        <Brand>{car.brand}</Brand>
                        <Name>{car.name}</Name>
                    </Description>

                    <Rent>
                        <Periodo>{car.period}</Periodo>
                        <Price>R$ {car.price}</Price>
                    </Rent>
                </Details>

                <Accessorys>
                {
                    car.accessories.map(accessory => (
                        <Acessory 
                        key={accessory.type}
                        name={accessory.name} 
                        icon={getAcessoryIcon(accessory.type)} />
                    ))
                }
                </Accessorys>

                <About>
                    {car.about}
                </About>

            </Animated.ScrollView>

            <Footer>
                <Button title='Escolher periodo do Alguel' onPress={handleConfirmeRental}/>
            </Footer>

        </Container>
    );
}

const styles = StyleSheet.create({
    header: {
      position: 'absolute',
      overflow: 'hidden', 
      zIndex: 1,
    },
})