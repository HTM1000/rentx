import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import { Feather } from '@expo/vector-icons'
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider'; 
import { Acessory } from '../../components/Acessory';
import { Button } from '../../components/Button';
import { getAcessoryIcon } from '../../utils/getAccessoryIcon';
import { getPlatformDate } from '../../utils/getPlataformDate';
import { api } from '../../services/api';
import { Alert } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

import {
    Container,
    Header,
    CarImages,
    Content,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Periodo,
    Price,
    Accessorys,
    Footer,
    RentalPeriod,
    CalendarIcon,
    DateInfo,
    DateTitle,
    DateValue,
    RentalPrice,
    RentalPriceLabel,
    RentalPriceDetails,
    RentalPriceQuota,
    RentalPriceTotal,
} from './styles';
interface Params {
    car: CarDTO;
    dates: string[],
}
interface RentalPeriod {
    start: string;
    end: string;
}

export function SchedulingDetails(){
    const [loading, setLoading] = useState(false)
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { car, dates } = route.params as Params;
    const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
    const netInfo = useNetInfo();

    const rentTotal = Number(dates.length * car.price);

    async function handleConfirmeRental(){
        setLoading(true);

        await api.post(`rentals`, {
            user_id: 1,
            car_id: car.id,
            start_date: new Date(dates[0]),
            end_date: new Date(dates[dates.length - 1]),
            total: rentTotal,
        }).then(() => {
            navigation.navigate('Complete', {
            nextScreenRoute: 'Home',
            title: 'Carro Alugado!',
            message: `Agora voce só precisa ir\naté a concessionaria da RENTX\npegar o seu automóvel`
        })})
        .catch(() => {
            setLoading(false);
            Alert.alert('Não foi possivel confirmar o agendamento')
        })

    }

    function handleBack(){
        navigation.goBack();
    }

    useEffect(() => {
        setRentalPeriod({
            start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
            end: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy')
        })
    }, [])

    useEffect(() => {
        async function fetchCarUpdate(){
            const response = await api.get(`/cars/${car.id}`);
            setCarUpdated(response.data);
        }
        if(netInfo.isConnected === true){
            fetchCarUpdate();
        }
    }, [netInfo.isConnected])

        return (
            <Container>
                <Header>
                    <BackButton onPress={handleBack}/>
                </Header>

                <CarImages>
                        <ImageSlider imagesUrl={
                            !!carUpdated.photos ? carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail}]
                        }
                        />
                </CarImages>

                <Content>
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

                    {
                    carUpdated.accessories && 
                        <Accessorys>
                        {
                            carUpdated.accessories.map(accessory => (
                                <Acessory 
                                key={accessory.type}
                                name={accessory.name} 
                                icon={getAcessoryIcon(accessory.type)} />
                            ))
                        }
                        </Accessorys>
                    }

                    <RentalPeriod>
                        <CalendarIcon>
                            <Feather
                                name='calendar'
                                size={RFValue(24)}
                                color={theme.colors.shape}
                            />
                        </CalendarIcon>

                        <DateInfo>
                            <DateTitle>DE</DateTitle>
                            <DateValue>{rentalPeriod.start}</DateValue>
                        </DateInfo>

                        <Feather
                                name='chevron-right'
                                size={RFValue(10)}
                                color={theme.colors.text}
                        />

                        <DateInfo>
                            <DateTitle>ATE</DateTitle>
                            <DateValue>{rentalPeriod.end}</DateValue>
                        </DateInfo>
                    </RentalPeriod>

                    <RentalPrice>
                        <RentalPriceLabel>Total</RentalPriceLabel>
                        <RentalPriceDetails>
                            <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
                            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
                        </RentalPriceDetails>
                    </RentalPrice>
                </Content>

                <Footer>
                    <Button 
                    title='Alugar agora' 
                    color={theme.colors.success} 
                    onPress={handleConfirmeRental}
                    enabled={!loading}
                    loading={loading}
                    />
                </Footer>

            </Container>
        );
}