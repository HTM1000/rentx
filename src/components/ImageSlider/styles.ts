import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';

export const Container = styled.View`
    width: 100%;
`;

export const ImageIndexes = styled.View`
    flex-direction: row;
    align-self: flex-end;
    padding: 24px;
`;

export const CarImageWrapper = styled.View`
    width: ${Dimensions.get('window').width}px; //pega a largura do dispositivo do usuario
    height: 132px;

    justify-content: center;
    align-items: center;
`;

export const CarIMG = styled(FastImage)`
    width: 280px;
    height: 132px;
`;
