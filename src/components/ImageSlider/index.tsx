import React, { useRef, useState } from 'react';
import { FlatList, ViewToken } from 'react-native';
import { Bullet } from '../Bullet';

import {
Container,
ImageIndexes,
CarImageWrapper,
CarIMG,
} from './styles';

interface Props {
    imagesUrl: {
        id: string;
        photo: string;
    }[]
}

interface ChangeImagePros {
    viewableItems: ViewToken[];
    changed: ViewToken[];
}

export function ImageSlider({imagesUrl} : Props){
    const [imageIndex, setImageIndex] = useState(0);

    const IndexChange = useRef((info: ChangeImagePros) => {
        const index = info.viewableItems[0].index!
        setImageIndex(index)
    });

    return (
         <Container>
            <ImageIndexes>
               {
                   imagesUrl.map((item, index) =>(
                       <Bullet 
                            key={String(item.id)}
                            active={index === imageIndex}
                       />
                   ))
               }
            </ImageIndexes>

           
                <FlatList 
                    data={imagesUrl}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <CarImageWrapper>
                        <CarIMG 
                         source={{ uri: item.photo }}
                         resizeMode='contain'
                        />
                              
                        </CarImageWrapper>  
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={IndexChange.current}
                />
         

        </Container>
    );
}