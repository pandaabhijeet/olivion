import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SigninValidation } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate} from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const {toast} = useToast();

  const {checkAuthUser} = useUserContext();

  const {mutateAsync : signInAccount , isPending : isSigningIn} = useSignInAccount();

  const navigate = useNavigate();


  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    console.log(values);

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if(!session){
      return toast({title : 'Log in Failed. Please try again.'})
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn){
      form.reset();
      toast({title : 'Logged in successfully'});
      navigate('/');
    }else{
      return toast({title : 'Log in Failed. Please try again.'});
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-320 flex-center flex-col">
        <img src="/assets/images/logo.svg" />

        <h2 className="h3-bold md:h2-bold pt-3 sm:pt-12">
         Welcome! Please login
        </h2>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full mt-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary mt-4" type="submit">
            {isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account ?
            <Link
              to="/sign-up"
              className="text-blue-900 text-small-semibold ml-1"
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};
export default SigninForm;
