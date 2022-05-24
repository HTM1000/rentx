import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import {
    Container,
    Details,
    Brand,
    Name,
    About, 
    Rent, 
    Periodo,
    Price,
    Type,
    CarIMG,
} from './styles';
import { CarDTO } from '../../dtos/CarDTO'
import { getAcessoryIcon } from '../../utils/getAccessoryIcon';

interface Props extends RectButtonProps{
    data: CarDTO;
}

export function Car({ data, ...rest } : Props){
const MotorIcon = getAcessoryIcon(data.fuel_type);

return (
<Container {...rest}>
    <Details>
        <Brand>{data.brand}</Brand>
        <Name>{data.name}</Name>
        <About>
            <Rent>
                <Periodo>{data.period}</Periodo>
                <Price>{`R$ ${data.price}`}</Price>
            </Rent>
            <Type>
                <MotorIcon />
            </Type>
        </About>
    </Details>

    <CarIMG 
    source={{ uri: data.thumbnail }}
    resizeMode='contain'
    />
</Container>
);
}