document.addEventListener("DOMContentLoaded", async () => {
 const list=document.getElementById("people-list"), search=document.getElementById("people-search"), count=document.getElementById("people-count");
 if(!window.supabaseClient){list.textContent="Connect this site to Supabase by editing config.js.";return;}
 const client=window.supabaseClient;
 const [{data:profiles,error},{data:contributions,error:answerError}]=await Promise.all([
  client.from("profiles").select("id,name,location,location_lat,location_lng,introduction,interests,contribution,created_at").order("created_at",{ascending:false}),
  client.from("research_responses").select("profile_id,response,current_need,research_topics(title,slug)").order("updated_at",{ascending:false})
 ]);
 if(error){list.textContent="Couldn't load profiles: "+error.message;return;}
 const rows=profiles||[], answers=contributions||[];
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function render(){const q=search.value.toLowerCase().trim(), filtered=rows.filter(p=>[p.name,p.location,p.introduction,p.contribution,...(p.interests||[])].join(" ").toLowerCase().includes(q));count.textContent=filtered.length+" co-researchers";
  list.innerHTML=filtered.length?'<div class="peoplegrid">'+filtered.map(p=>{const mine=answers.filter(r=>r.profile_id===p.id);return '<article class="person"><div class="personhead"><span class="avatar">'+esc((p.name||"?")[0].toUpperCase())+'</span><div><h2>'+esc(p.name||"Commons member")+'</h2><small>'+esc(p.location||"Location not shared")+'</small></div></div>'+(p.introduction?'<p>'+esc(p.introduction)+'</p>':'')+'<div class="tags">'+(p.interests||[]).map(x=>'<span>'+esc(x)+'</span>').join("")+'</div>'+(p.contribution?'<details class="profile-detail"><summary>More about this co-researcher</summary><div class="contribution"><small>LOREM IPSUM</small><p>'+esc(p.contribution)+'</p></div></details>':'')+(mine.length?'<details class="profile-detail"><summary>Research contributions ('+mine.length+')</summary><div class="profile-research">'+mine.map(r=>'<div class="profile-answer"><strong>'+esc(r.research_topics?.title||"Research question")+'</strong><p>'+esc(r.response)+'</p></div>').join("")+'</div></details>':'')+'</article>';}).join("")+'</div>':'<p>No profiles found yet. Be the first to introduce yourself.</p>';}
 search.addEventListener("input",render);render();
});