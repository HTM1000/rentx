import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { format } from 'date-fns'
import { BackButton } from '../../components/BackButton'
import { Alert, StatusBar } from 'react-native';
import { Button } from '../../components/Button';
import { Calendar, DayProps, generateInterval, MarkedDateProps } from '../../components/Calendar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getPlatformDate } from '../../utils/getPlataformDate';
import { CarDTO } from '../../dtos/CarDTO';
import ArrowSVG from '../../assets/arrow.svg'

import {
    Container,
    Header,
    Title,
    RentalPeriod,
    DateInfo,
    DateTitle,
    DateValue,
    Content,
    Footer,
    DateValueContainer
} from './styles';


interface RentalPeriod {
    startFormatted: string;
    endFormatted: string;
}

interface Params {
    car: CarDTO;
}

export function Scheduling(){
    const [lastSelectedDate, setLestSelectedDate] = useState<DayProps>({} as DayProps);
    const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

    const theme = useTheme();
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { car } = route.params as Params;

    function handleConfirmeRental(){
        if(!rentalPeriod.startFormatted || !rentalPeriod.endFormatted){
            Alert.alert("Selecione o intervalo para alugar")
        }else {
        navigation.navigate('SchedulingDetails', {
            car,
            dates: Object.keys(markedDates),
        })
        }
    }

    function handleBack(){
        navigation.goBack();
    }

    function handleChangeDate(date: DayProps){
        let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
        let end = date;

        if(start.timestamp > end.timestamp){
            start = end;
            end = start;
        }
        setLestSelectedDate(end);
        const interval = generateInterval(start, end);
        setMarkedDates(interval);

        const firstDate = Object.keys(interval)[0]
        const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

        setRentalPeriod({
            startFormatted: format(getPlatformDate(new Date(firstDate)), 'dd/MM/yyyy'),
            endFormatted: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy' ),
        })
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

                    <RentalPeriod>
                        <DateInfo>
                            <DateTitle>DE</DateTitle>
                            <DateValueContainer selected={!!rentalPeriod.startFormatted}>
                                <DateValue> {rentalPeriod.startFormatted} </DateValue>
                            </DateValueContainer>
                        </DateInfo>

                        <ArrowSVG />

                        <DateInfo>
                            <DateTitle>ATÉ</DateTitle>
                            <DateValueContainer selected={!!rentalPeriod.endFormatted}>
                                <DateValue> {rentalPeriod.endFormatted} </DateValue>
                            </DateValueContainer>
                        </DateInfo>
                    </RentalPeriod>
             </Header>

             <Content>
                <Calendar 
                    markedDates={markedDates}
                    onDayPress={handleChangeDate}
                />
             </Content>

             <Footer>
                 <Button 
                 title='Confirmar' 
                 onPress={handleConfirmeRental} 
                 enabled={!!rentalPeriod.startFormatted}
                 />
             </Footer>

        </Container>
    );
}