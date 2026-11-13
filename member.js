document.addEventListener("DOMContentLoaded", async () => {
 const root=document.getElementById("member-profile");
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const id=new URLSearchParams(window.location.search).get("id");
 const client=window.supabaseClient;
 if(!client){root.innerHTML='<p class="error">Supabase is not configured. Check config.js.</p>';return;}
 if(!id){root.innerHTML='<p class="error">No co-researcher was specified.</p>';return;}
 const [{data:profile,error},{data:answers,error:answerError}]=await Promise.all([
  client.from("profiles").select("id,name,location,introduction,interests,contribution").eq("id",id).maybeSingle(),
  client.from("research_responses").select("response,updated_at,research_topics(title,slug)").eq("profile_id",id).order("updated_at",{ascending:false})
 ]);
 if(error){root.innerHTML='<p class="error">Could not load this profile: '+esc(error.message)+'</p>';return;}
 if(!profile){root.innerHTML='<h1>Profile not found.</h1><p>This co-researcher profile may no longer be available.</p>';return;}
 const name=profile.name||"Commons member";
 document.title=name+" — Solarpunk Commons";
 root.innerHTML=`
  <p class="eyebrow">A CO-RESEARCHER IN THE COMMONS</p>
  <div class="member-heading"><span class="avatar">${esc(name.trim().charAt(0).toUpperCase()||"?")}</span><div><h1>${esc(name)}</h1><p class="member-location">${esc(profile.location||"Location not shared")}</p></div></div>
  ${profile.introduction?`<section class="member-section"><h2>Introduction</h2><p>${esc(profile.introduction)}</p></section>`:""}
  ${(profile.interests||[]).length?`<section class="member-section"><h2>Areas of interest</h2><div class="tags">${profile.interests.map(x=>`<span>${esc(x)}</span>`).join("")}</div></section>`:""}
  ${profile.contribution?`<section class="member-section"><h2>Contribution to the commons</h2><p>${esc(profile.contribution)}</p></section>`:""}
  <section class="member-section"><h2>Research contributions</h2>${answerError?`<p class="error">Could not load research contributions: ${esc(answerError.message)}</p>`:(answers||[]).length?(answers||[]).map(a=>`<article class="member-answer"><h3>${esc(a.research_topics?.title||"Research question")}</h3><p>${esc(a.response).replace(/\n/g,"<br>")}</p></article>`).join(""):'<p class="muted">This co-researcher has not added any research contributions yet.</p>'}</section>
  <p><a class="text-link" href="people.html">Explore all co-researchers →</a></p>`;
});
