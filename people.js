document.addEventListener("DOMContentLoaded", async () => {
 const list=document.getElementById("people-list"), search=document.getElementById("people-search"), count=document.getElementById("people-count");
 if(!window.supabaseClient){list.textContent="Connect this site to Supabase by editing config.js.";return;}
 const {data,error}=await window.supabaseClient.from("profiles").select("id,name,location,introduction,interests,contribution,created_at").order("created_at",{ascending:false});
 if(error){list.textContent="Couldn't load profiles: "+error.message;return;}
 const profiles=data||[];
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function render(){const q=search.value.toLowerCase().trim(), rows=profiles.filter(p=>[p.name,p.location,p.introduction,p.contribution,...(p.interests||[])].join(" ").toLowerCase().includes(q));count.textContent=rows.length+" people";list.innerHTML=rows.length?'<div class="peoplegrid">'+rows.map(p=>'<article class="person"><div class="personhead"><span class="avatar">'+esc((p.name||"?")[0].toUpperCase())+'</span><div><h2>'+esc(p.name||"Commons member")+'</h2><small>'+esc(p.location||"Location not shared")+'</small></div></div><p>'+esc(p.introduction||"")+'</p><div class="tags">'+(p.interests||[]).map(x=>'<span>'+esc(x)+'</span>').join("")+'</div>'+(p.contribution?'<div class="contribution"><small>CURIOUS ABOUT / CONTRIBUTING TO</small><p>'+esc(p.contribution)+'</p></div>':"")+'</article>').join("")+'</div>':'<p>No profiles found yet. Be the first to introduce yourself.</p>';}
 search.addEventListener("input",render);render();
});
