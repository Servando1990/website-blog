import{j as t}from"./jsx-runtime.D_zvdyIk.js";import{r as c}from"./index.RH_Wq4ov.js";import{c as n}from"./createLucideIcon.DEd7bZyu.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],l=n("moon",h);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],i=n("sun",d);function k(){const[o,a]=c.useState("light");c.useEffect(()=>{const e=localStorage.getItem("theme"),m=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",s=e||m;a(s),document.documentElement.classList.toggle("dark",s==="dark")},[]);const r=()=>{const e=o==="light"?"dark":"light";a(e),localStorage.setItem("theme",e),document.documentElement.classList.toggle("dark",e==="dark")};return t.jsx("button",{onClick:r,className:"inline-flex items-center justify-center h-9 w-9 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors","aria-label":"Toggle theme",children:o==="light"?t.jsx(l,{className:"h-4 w-4"}):t.jsx(i,{className:"h-4 w-4"})})}export{k as default};
