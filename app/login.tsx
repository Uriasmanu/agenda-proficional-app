import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

// --- Componente de Cabeçalho Reutilizável ---
const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => (
    <View style={headerStyles.header}>
        <Text style={headerStyles.title}>{title}</Text>
        <Text style={headerStyles.subtitle}>{subtitle}</Text>
    </View>
);

const headerStyles = StyleSheet.create({
    header: {
        marginBottom: 48,
    },
    title: {
        fontSize: 32,
        fontWeight: '700', 
        textAlign: 'center',
        color: '#1a1a1a',
        marginBottom: 4, 
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
});

// --- Tela Principal (Gerencia Login e Cadastro) ---
export default function LoginScree() {
    const [isLogin, setIsLogin] = useState(true); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [name, setName] = useState(''); 
    const [loading, setLoading] = useState(false);

    // Função genérica de manipulação (Login ou Cadastro)
    const handleAuth = async () => {
        setLoading(true);

        if (isLogin) {
            // --- Lógica de Login Aprimorada ---
            if (!email || !password) {
                Alert.alert('Erro', 'Preencha todos os campos para fazer login');
                setLoading(false);
                return;
            }

            try {
                console.log('Login attempt:', { email, password });
                await new Promise(resolve => setTimeout(resolve, 1500)); 

               
                setEmail('');
                setPassword('');

                router.replace('/(tabs)');
            } catch (error) {
                Alert.alert('Erro', 'Falha no login. Verifique suas credenciais.');
            }
        } else {
            // --- Lógica de Cadastro ---
            if (!name || !email || !password || !confirmPassword) {
                Alert.alert('Erro', 'Preencha todos os campos para se cadastrar');
                setLoading(false);
                return;
            }

            if (password !== confirmPassword) {
                Alert.alert('Erro', 'A senha e a confirmação de senha não coincidem.');
                setLoading(false);
                return;
            }

            try {
                console.log('Register attempt:', { name, email, password });
                await new Promise(resolve => setTimeout(resolve, 1500));

                Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Faça login para continuar.');
                
                // Redireciona para a tela de Login após o cadastro
                setIsLogin(true);
                // Limpa os campos do formulário
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');

            } catch (error) {
                Alert.alert('Erro', 'Falha no cadastro. Tente novamente.');
            }
        }

        setLoading(false);
    };

    // Texto dinâmico para o botão principal
    const buttonText = isLogin ? (loading ? 'Entrando...' : 'Entrar') : (loading ? 'Cadastrando...' : 'Cadastrar');
    const toggleAuthText = isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?';
    const toggleLinkText = isLogin ? 'Cadastre-se' : 'Faça login';

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                {/* 1. Cabeçalho Dinâmico */}
                <AuthHeader 
                    title="Agenda Profissional" 
                    subtitle={isLogin ? 'Faça login em sua conta' : 'Crie sua conta gratuitamente'} 
                />
                
                <View style={styles.form}>
                    {/* 2. Campo de Nome (Apenas Cadastro) */}
                    {!isLogin && (
                        <TextInput
                            style={styles.input}
                            placeholder="Nome Completo"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoComplete="name"
                        />
                    )}

                    {/* 3. Campos Comuns (E-mail e Senha) */}
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress" 
                    />
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        textContentType={isLogin ? "password" : "newPassword"} 
                    />

                    {/* 4. Campo de Confirmação de Senha (Apenas Cadastro) */}
                    {!isLogin && (
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar Senha"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            textContentType="newPassword"
                        />
                    )}

                    {/* 5. Botão Principal */}
                    <TouchableOpacity 
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleAuth}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        )}
                    </TouchableOpacity>
                    
                    {/* 6. Opções Secundárias (Apenas Login) */}
                    {isLogin && (
                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>
                                Esqueceu sua senha?
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                
                {/* 7. Footer de Alternância */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        {toggleAuthText}{' '}
                        <Text 
                            style={styles.footerLink} 
                            onPress={() => setIsLogin(!isLogin)} 
                        >
                            {toggleLinkText}
                        </Text>
                    </Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

// --- Estilos Aprimorados ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa', 
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    form: {
        width: '100%',
    },
    input: {
        height: 52, 
        borderWidth: 1,
        borderColor: '#e0e0e0', 
        borderRadius: 8, 
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#fff', 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    button: {
        height: 52, 
        backgroundColor: '#34A853',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: '#a3d9b1',
        elevation: 0,
        shadowOpacity: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18, 
        fontWeight: '700',
    },
    forgotPassword: {
        alignItems: 'center',
        marginTop: 20, 
    },
    forgotPasswordText: {
        color: '#007AFF', 
        fontSize: 15,
        fontWeight: '600',
    },
    footer: {
        marginTop: 60, 
        alignItems: 'center',
    },
    footerText: {
        color: '#666',
        fontSize: 15,
    },
    footerLink: {
        color: '#34A853',
        fontWeight: '700',
    },
});