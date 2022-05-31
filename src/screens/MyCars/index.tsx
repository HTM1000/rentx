import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { StatusBar, FlatList } from 'react-native';
import { BackButton } from '../../components/BackButton';
import { useNavigation, useIsFocused } from '@react-navigation/core';
import { useTheme } from 'styled-components';
import { Car } from '../../components/Car';
import { AntDesign } from '@expo/vector-icons';
import { LoadAnimation } from '../../components/LoadAnimation';
import { Car as ModelCar } from '../../database/model/Car';
import { format, parseISO } from 'date-fns';

import {
    Container,
    Header,
    Title,
    SubTitle,
    Content,
    Appointments,
    AppointmentsTitle,
    AppointmentsQuantity,
    CarWrapper,
    CarFooter,
    CarFooterTitle,
    CarFooterPeriod,
    CarFooterDate,
} from './styles';
interface DataProps {
    id: string;
    car: ModelCar;
    start_date: string;
    end_date: string;
}

export function MyCars(){
    const [cars, setCars] = useState<DataProps[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const theme = useTheme();
    const screenIsFocus = useIsFocused();

    useEffect(() => {
        async function fetchCars(){
            try {
                const response = await api.get('/rentals');
                const dataFormatted = response.data.map(( data: DataProps ) => {
                    return {
                        id: data.id,
                        car: data.car,
                        start_date: format(parseISO(data.start_date), 'dd/MM/yyyy'),
                        end_date: format(parseISO(data.end_date), 'dd/MM/yyyy'),
                    }
                })
                setCars(dataFormatted)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchCars();
    }, [screenIsFocus])

    function handleBack(){
        navigation.goBack();
    }

    return (
        <Container>
             <Header>
                <StatusBar
                barStyle='light-content'
                translucent
                backgroundColor='transparent'
                />
                    <BackButton 
                    onPress={handleBack}
                    color={theme.colors.shape}
                    />

                    <Title>
                        Escolha uma {'\n'}
                        data de inicio e {'\n'}
                        fim do aluguel
                    </Title>

                    <SubTitle>
                        conforto, segurança e praticidade
                    </SubTitle>
             </Header>
             { loading ? <LoadAnimation /> :   
             
             <Content>
                 <Appointments>
                    <AppointmentsTitle>Agendamentos Feitos</AppointmentsTitle>
                    <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
                 </Appointments>

                <FlatList 
                    data={cars}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => 
                    <CarWrapper>
                    <Car data={item.car}/>
                    <CarFooter>
                        <CarFooterTitle>Periodo</CarFooterTitle>
                        <CarFooterPeriod>
                            <CarFooterDate>{item.start_date}</CarFooterDate>
                            <AntDesign 
                                name="arrowright"
                                size={20}
                                color={theme.colors.title}
                                style={{ marginHorizontal: 10 }}
                            />
                            <CarFooterDate>{item.end_date}</CarFooterDate>
                        </CarFooterPeriod>
                    </CarFooter>
                    </CarWrapper>
                    }
                />

             </Content>
             
             } 
        </Container>
    );
}