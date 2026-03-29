import { supabase } from "@/lib/supabaseClient"

export async function createProfile(user, name, role) {
    const { error } = await supabase.from("profiles").insert({
        id: user.id,
        name: name,
        role: role,
    })

    if (error) {
        console.log(error)
    }
    else {
        console.log("Profile created successfully", JSON.stringify(user))
    }
}