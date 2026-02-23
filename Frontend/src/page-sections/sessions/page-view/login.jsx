import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import useAuth from '@/hooks/useAuth';
import Layout from '../Layout';
import Link from '@/components/link';
import { FlexBetween, FlexBox } from '@/components/flexbox';
import { FormProvider, TextField } from '@/components/form';
import GoogleIcon from '@/icons/GoogleIcon';
import Twitter from '@/icons/social/Twitter';
import Facebook from '@/icons/social/Facebook';
import { SocialButton, StyledDivider } from '../styles';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().min(6, 'Password should be of minimum 6 characters length').required('Password is required'),
  remember: Yup.boolean().optional()
});

export default function LoginPageView() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const {
    signInWithEmail,
    signInWithGoogle
  } = useAuth();

  const handleGoogle = async () => {
    await signInWithGoogle();
  };

  const initialValues = {
    email: '',
    password: '',
    remember: true
  };
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });
  const {
    watch,
    setValue,
    handleSubmit,
    formState: {
      isSubmitting,
      isValid
    }
  } = methods;
  const handleFormSubmit = handleSubmit(async values => {
    try {
      setError('');
      await signInWithEmail(values.email, values.password);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password. Please try again.');
    }
  });
  return <Layout login>
      <Box maxWidth={550} p={4}>
        <Typography variant="h4" fontWeight={600} fontSize={{
        sm: 30,
        xs: 25
      }}>
          Sign In
        </Typography>



        <FormProvider methods={methods} onSubmit={handleFormSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, mt: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="body1" fontSize={16} mb={1.5}>
                
              </Typography>

              <TextField 
                fullWidth 
                name="email" 
                placeholder="Enter your work email"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'grey.400',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'grey.500',
                      boxShadow: 'none'
                    }
                  }
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField 
                fullWidth 
                placeholder="Password" 
                type={showPassword ? 'text' : 'password'} 
                name="password" 
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'grey.400',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'grey.500',
                      boxShadow: 'none'
                    }
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: <ButtonBase disableRipple disableTouchRipple onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </ButtonBase>
                  }
                }} 
              />

              <FlexBetween my={1}>
                <FlexBox alignItems="center" gap={1}>
                  <Checkbox sx={{
                  p: 0
                }} name="remember" checked={watch('remember')} onChange={e => setValue('remember', e.target.checked)} />
                  <Typography variant="body2" fontWeight={500}>
                    Remember me
                  </Typography>
                </FlexBox>

                <Box fontSize={13} component={Link} fontWeight={500} color="error.500" href="/forget-password">
                  Forgot Password?
                </Box>
              </FlexBetween>
            </Grid>

            <Grid size={12}>
              <Button fullWidth type="submit" variant="contained" disabled={!isValid} loading={isSubmitting}>
                Sign In
              </Button>
            </Grid>
          </Grid>
        </FormProvider>

       
      </Box>
    </Layout>;
}
