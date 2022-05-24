import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Bullet } from '../../../components/Bullet';
import { BackButton } from '../../../components/BackButton';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import * as Yup from 'yup'


import {
    Container,
    Header,
    Steps,
    Title,
    SubTitle,
    Form,
    FormTitle
} from './styles';

export function SignUpFirstStep(){
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [driverLicense, setDriverLicense] = useState('');
  
    function handleBack(){
        navigation.goBack()
    }

    async function handleNextStep(){
        try {
            const schema = Yup.object().shape({
                driverLicense: Yup.string().required('CNH é obrigatória').min(9, 'Minimo de nove caracteres'),
                email: Yup.string().email('E-mail invalido').required('E-mail obrigatório'),
                name: Yup.string().required('Nome obrigatório'),
            });

            const data = { name, email, driverLicense }
            await schema.validate(data);

            navigation.navigate('SignUpSecondaryStep', { user: data})
        } catch (error) {
            if(error instanceof Yup.ValidationError){
                return Alert.alert('Opa', error.message)
            }
        }
       
    }

    return (
        <KeyboardAvoidingView behavior='position' enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Header>
                        <BackButton onPress={handleBack}/>
                        <Steps>
                        <Bullet active />
                        <Bullet />
                        </Steps>
                    </Header>

                    <Title>
                        Crie sua{'\n'}conta
                    </Title>

                    <SubTitle>
                        Faça seu cadastro de{'\n'}
                        forma rápida e fácil
                    </SubTitle>

                    <Form>
                        <FormTitle>1. DADOS</FormTitle>
                        <Input 
                            iconName='user'
                            placeholder='Nome'
                            onChangeText={setName}
                            value={name}
                        />
                        <Input 

                            iconName='mail'
                            placeholder='E-mail'
                            keyboardType='email-address'
                            onChangeText={setEmail}
                            value={email}
                        />
                        <Input 
                            iconName='credit-card'
                            placeholder='CNH'
                            keyboardType='numeric'
                            onChangeText={setDriverLicense}  
                            value={driverLicense}            
                        />
                    </Form>

                    <Button 
                        title='Proximo'
                        onPress={handleNextStep}
                    />
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}