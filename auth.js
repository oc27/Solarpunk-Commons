document.addEventListener("DOMContentLoaded", () => {
 const form = document.getElementById("register-form"), msg = document.getElementById("form-message"), btn = form.querySelector("button");
 form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!window.supabaseClient) { msg.textContent = "Connect Supabase first: add your project URL and publishable key to config.js."; return; }
  const interests = [...form.querySelectorAll('input[name="interests"]:checked')].map(x => x.value);
  const values = Object.fromEntries(["name","location","introduction","contribution"].map(k => [k, form.elements[k].value.trim()]));
  btn.disabled = true; btn.textContent = "Creating your account…";
  const {error} = await window.supabaseClient.auth.signUp({email:form.elements.email.value.trim(),password:form.elements.password.value,options:{emailRedirectTo:location.origin+"/profile.html",data:{...values,location_lat:form.elements.location_lat.value||null,location_lng:form.elements.location_lng.value||null,interests}}});
  btn.disabled = false; btn.textContent = "Join the commons ↗";
  if(error){msg.textContent=error.message;msg.className="error";return;}
  msg.textContent="Thanks for joining. Check your email for a confirmation link. Your profile will appear in the directory once your email is confirmed.";
  msg.className="success"; form.reset();
 });
});
