import { supabase } from "@/lib/supabaseClient"

export async function addScore(userId, score, scoreDate) {
  // insert new score
  const { error } = await supabase
    .from("scores")
    .insert({
      user_id: userId,
      score,
      score_date: scoreDate,
    })

  if (error) throw error

  // check total scores
  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })

  // delete oldest if > 5
  if (scores.length > 5) {
    const oldest = scores[0]

    await supabase
      .from("scores")
      .delete()
      .eq("id", oldest.id)
  }
}