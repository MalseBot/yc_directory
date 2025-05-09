
'use client'

import React, {useActionState, useState} from 'react'
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import MDEditor from '@uiw/react-md-editor';
import {Button} from "@/components/ui/button";
import {Send} from "lucide-react";
import {formSchema} from "@/lib/validation";
import { useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {createPitch} from "@/lib/action";
import {z} from "zod";


const StartupForm = () => {
    const [errors, setErrors] = useState<Record <string,string>>({});
    const [pitch, setPitch] = useState("**briefly describe your idea**");

    const {toast} = useToast();

    const router = useRouter()
    const handleSubmit = async(prevState:unknown,formData:FormData)=>{
        try {
            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                link: formData.get("link") as string,
                pitch,
            };

            await formSchema.parseAsync(formValues);

            const result = await createPitch(prevState, formData, pitch);

            if (result.status == "SUCCESS") {
                toast({
                    title: "Success",
                    description: "Your startup pitch has been created successfully",
                });

                router.push(`/startup/${result._id}`);
            }

            return result;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErorrs = error.flatten().fieldErrors;

                setErrors(fieldErorrs as unknown as Record<string, string>);

                toast({
                    title: "Error",
                    description: "Please check your inputs and try again",
                    variant: "destructive",
                });

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                /* @ts-expect-error */
                return { ...prevState, error: "Validation failed", status: "ERROR" };
            }

            toast({
                title: "Error",
                description: "An unexpected error has occurred",
                variant: "destructive",
            });
            
            return {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
                ...prevState,
                error: "An unexpected error has occurred",
                status: "ERROR",
            };
        }
    };
    //@typescript-eslint/no-unused-vars
    const [,formAction, isPending] = useActionState(handleSubmit, {error:'',status:'initial'});
    return (
        <form action={formAction} className={'startup-form'}>
            <div>
                <Label htmlFor='title' className={'startup-form_label'}>Title</Label>
                <Input
                    id='title'
                    name='title'
                    placeholder='The great invintion'
                    className={'startup-form_input'}
                    required={true}
                />
                {errors.title && <p className="startup-form_error">{errors.title}</p>}
            </div>
            <div>
                <Label htmlFor='description' className={'startup-form_label'}>description</Label>
                <Textarea
                    id='description'
                    name='description'
                    placeholder='info about it'
                    className={'startup-form_input'}
                    required={true}
                />
                {errors.description && <p className="startup-form_error">{errors.description}</p>}
            </div>
            <div>
                <Label htmlFor='link' className={'startup-form_label'}>Image Url</Label>
                <Input
                    id='link'
                    name='link'
                    placeholder='image Url'
                    className={'startup-form_input'}
                    required={true}
                />
                {errors.link && <p className="startup-form_error">{errors.link}</p>}
            </div>
            <div>
                <Label htmlFor='category' className={'startup-form_label'}>Category</Label>
                <Input
                    id='category'
                    name='category'
                    placeholder='tech,nature,education....'
                    className={'startup-form_input'}
                    required={true}
                />
                {errors.category && <p className="startup-form_error">{errors.category}</p>}
            </div>

            <div data-color-mode={'light'}>
                <Label htmlFor='pitch' className={'startup-form_label'}>Pitch</Label>
                <MDEditor
                    value={pitch}
                    onChange={(value)=>setPitch(value as string)}
                    id={'pitch'}
                    height={300}
                    preview={'edit'}
                    style={{borderRadius: '20',overflow: 'hidden'}}
                />
                {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}

            </div>
            <Button type={'submit'} className={'startup-form_btn text-white'} disabled={isPending}>
                {isPending ? 'Submitting ...' :'Submit'} <Send className={'size-6 ml-2'}/></Button>


        </form>
    )
}
export default StartupForm
