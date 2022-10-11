import { yupResolver } from "@hookform/resolvers/yup";
import {
  AppBar,
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Toolbar
} from "@mui/material";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { statusIcons, useDebounce } from "./hooks/useDebounce";

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
      email: "",
      password: "",
      code: "",
    },
    resolver: yupResolver(formSchema),
    mode: "onTouched",
  });
  const code = watch("code");
  const codeValidationStatus = useDebounce({ value: code });
  const password = watch("password");

  const pswValidationFn = useCallback((psw: string) => {
    if (psw === "password") return "ok";

    return "error";
  }, []);

  const passwordValidationStatus = useDebounce({
    value: password,
    debounceTime: 2000,
    action: pswValidationFn,
  });

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
                  error={passwordValidationStatus === "error"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {statusIcons[passwordValidationStatus]}
                      </InputAdornment>
                    ),
                  }}
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
                    endAdornment: (
                      <InputAdornment position="end">
                        {statusIcons[codeValidationStatus]}
                      </InputAdornment>
                    ),
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
