import { supabase } from "@/lib/supabaseClient"

export async function createProfile(user) {
    const { error } = await supabase.from("profiles").insert({
        id: user.id,
        name: "",
    })

    if (error) {
        console.log(error)
    }
    else {
        console.log("Profile created successfully", JSON.stringify(user))
    }
}