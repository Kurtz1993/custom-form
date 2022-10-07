import { yupResolver } from '@hookform/resolvers/yup';
import { CheckCircle, Error } from '@mui/icons-material';
import { AppBar, Button, Card, CardContent, CircularProgress, InputAdornment, TextField, Toolbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

const codeIcons = {
  ok: <CheckCircle color="success" />,
  error: <Error color="error" />,
  inProgress: <CircularProgress className="!w-6 !h-6" />,
  idle: null,
} as const;

const formSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  code: yup.string().required(),
});

function App() {
  const {
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
    resolver: yupResolver(formSchema),
    mode: 'onTouched'
  });
  const code = watch('code');
  const [codeValidationStatus, setCodeValidationStatus] = useState<keyof typeof codeIcons>('idle');

  useEffect(() => {
    setCodeValidationStatus(code ? 'inProgress' : 'idle');
    let timeoutId: number;

    if (code) {
      timeoutId = window.setTimeout(() => {
        setCodeValidationStatus(code === 'code' ? 'ok' : 'error');
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [code]);

  return (
    <main>
      <AppBar position="static">
        <Toolbar variant="regular">
          <h1>Custom form</h1>
        </Toolbar>
      </AppBar>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(console.log)} noValidate>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="!pb-6"
                  variant="outlined"
                  label="Email"
                  type="email"
                  helperText={errors.email?.message}
                  error={!!errors.email}
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="!pb-6"
                  variant="outlined"
                  label="Password"
                  type="password"
                  helperText={errors.password?.message}
                  error={!!errors.password}
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="!pb-6"
                  variant="outlined"
                  label="Code"
                  type="code"
                  helperText={errors.code?.message}
                  error={!!errors.code}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{codeIcons[codeValidationStatus]}</InputAdornment>,
                  }}
                  required
                  fullWidth
                />
              )}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
