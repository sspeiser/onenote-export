(this["webpackJsonponenote-export"]=this["webpackJsonponenote-export"]||[]).push([[0],{228:function(e,t,n){},402:function(e,t,n){"use strict";n.r(t);var r=n(3),a=n(1),s=n.n(a),i=n(103),c=n.n(i),o=(n(228),n(57)),u=n(5),l=n(6),p=n(21),h=n(22),d=n(2),b=n.n(d),f=n(19),j=n(12),x=n(138),v=n(221),O=n(72),m=n.n(O),g=n(73),y=n(213),k=n.n(y),w=function e(t,n){Object(u.a)(this,e),this.label=void 0,this.id=void 0,this.label=null==t?"undefinedLabel"+e.undefinedLabel++:t,this.id=null==n?"undefinedId"+e.undefinedId++:n};w.undefinedId=0,w.undefinedLabel=0;var N=function(e){Object(p.a)(n,e);var t=Object(h.a)(n);function n(){var e;Object(u.a)(this,n);for(var r=arguments.length,a=new Array(r),s=0;s<r;s++)a[s]=arguments[s];return(e=t.call.apply(t,[this].concat(a))).children=[],e}return n}(w),A=function(e){Object(p.a)(n,e);var t=Object(h.a)(n);function n(e,r,a,s,i,c){var o;return Object(u.a)(this,n),(o=t.call(this,e,r)).contentURL=void 0,o.notebook=void 0,o.sectionGroup=void 0,o.section=void 0,o.contentURL=a,o.notebook=s,o.sectionGroup=i,o.section=c,o}return n}(w);function E(e){return S.apply(this,arguments)}function S(){return(S=Object(f.a)(b.a.mark((function e(t){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,n){t.get((function(t,r){t&&n(t),e(r)}))})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function C(e,t){return P.apply(this,arguments)}function P(){return(P=Object(f.a)(b.a.mark((function e(t,n){var r,a,s,i;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=L(t),e.next=3,r.api(n).get();case 3:if(!(a=e.sent)["@odata.nextLink"]){e.next=12;break}return s=[],i=new x.b(r,a,(function(e){return s.push(e),!0})),e.next=9,i.iterate();case 9:return e.abrupt("return",s);case 12:return e.abrupt("return",a.value);case 13:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function R(e){return T.apply(this,arguments)}function T(){return(T=Object(f.a)(b.a.mark((function e(t){var n,r,a,s,i,c,o;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=L(t),e.next=3,E(n.api("/me/onenote/notebooks/").expand("sections,sectionGroups($expand=sections)")).catch(console.log);case 3:r=e.sent,a=[],s=[],i=Object(j.a)(r.value);try{for(o=function(){var e=c.value,n=new N(e.displayName,e.id);a.push(n);var r,i=Object(j.a)(e.sections);try{var o=function(){var a=r.value,i=new N(a.displayName,a.id);n.children.push(i),s.push(C(t,a.pagesUrl).then((function(t){var n,r=Object(j.a)(t);try{for(r.s();!(n=r.n()).done;){var s=n.value;i.children.push(new A(s.title,s.id,s.contentUrl,e.displayName,".",a.displayName))}}catch(c){r.e(c)}finally{r.f()}})))};for(i.s();!(r=i.n()).done;)o()}catch(h){i.e(h)}finally{i.f()}var u,l=Object(j.a)(e.sectionGroups);try{var p=function(){var r=u.value,a=new N(r.displayName,r.id);n.children.push(a);var i,c=Object(j.a)(r.sections);try{var o=function(){var n=i.value,c=new N(n.displayName,n.id);a.children.push(c),s.push(C(t,n.pagesUrl).then((function(t){var a,s=Object(j.a)(t);try{for(s.s();!(a=s.n()).done;){var i=a.value;c.children.push(new A(i.title,i.id,i.contentUrl,e.displayName,r.displayName,n.displayName))}}catch(h){s.e(h)}finally{s.f()}})))};for(c.s();!(i=c.n()).done;)o()}catch(h){c.e(h)}finally{c.f()}};for(l.s();!(u=l.n()).done;)p()}catch(h){l.e(h)}finally{l.f()}},i.s();!(c=i.n()).done;)o()}catch(u){i.e(u)}finally{i.f()}return e.next=10,Promise.all(s);case 10:return e.abrupt("return",a);case 11:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function L(e){return x.a.init({authProvider:function(t){t(null,e)}})}function M(e){return U.apply(this,arguments)}function U(){return(U=Object(f.a)(b.a.mark((function e(t){var n,r;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=L(t),e.next=3,n.api("/me").select("displayName,mail,userPrincipalName").get();case 3:return r=e.sent,e.abrupt("return",r);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function B(e,t,n,r,a,s){return _.apply(this,arguments)}function _(){return(_=Object(f.a)(b.a.mark((function e(t,n,r,a,s,i){var c,o,u,l,p;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(c=L(t),o=n.split(/\//).slice(0,-1).pop(),u=r.split(/\//).pop(),!s[l="resources/"+o+"."+u]){e.next=7;break}return console.log("Resource already present"),e.abrupt("return",l);case 7:return s[l]=!0,e.next=10,c.api(n).getStream();case 10:if(p=e.sent){e.next=13;break}return e.abrupt("return",l);case 13:return i.write({name:a+"/"+l,stream:function(){return p}}),e.abrupt("return",l);case 15:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function z(e,t,n,r,a,s){return I.apply(this,arguments)}function I(){return(I=Object(f.a)(b.a.mark((function e(t,n,r,a,s,i){var c,o,u,l,p,h,d,f,x,v,O,m,g,y,w,N,A,E;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(c=[],o="/"+n.notebook+"/"+n.sectionGroup+"/"+n.section,0,u="../".repeat(o.split("/").map((function(e){return"."===e||""===e?0:".."===e?-1:1})).reduce((function(e,t){return e+t}),0)),!i.images){e.next=24;break}l=r.getElementsByTagName("img"),p=Object(j.a)(l),e.prev=7,d=function(){var e=h.value,n=e.getAttribute("data-fullres-src")||e.getAttribute("src");if(!n)return"continue";var r=e.getAttribute("data-fullres-src-type")||e.getAttribute("data-src-type");c.push(B(t,n,r,"",a,s).then((function(t){return e.setAttribute("src",u+t)})))},p.s();case 10:if((h=p.n()).done){e.next=16;break}if("continue"!==d()){e.next=14;break}return e.abrupt("continue",14);case 14:e.next=10;break;case 16:e.next=21;break;case 18:e.prev=18,e.t0=e.catch(7),p.e(e.t0);case 21:return e.prev=21,p.f(),e.finish(21);case 24:if(!i.resources){e.next=44;break}f=r.getElementsByTagName("object"),x=Object(j.a)(f),e.prev=27,O=function(){var e=v.value;if(!e.hasAttribute("data"))return"continue";if(!e.hasAttribute("type"))return"continue";var n=e.getAttribute("data");c.push(B(t,n,e.getAttribute("type"),"",a,s).then((function(t){return e.setAttribute("data",u+t)})))},x.s();case 30:if((v=x.n()).done){e.next=36;break}if("continue"!==O()){e.next=34;break}return e.abrupt("continue",34);case 34:e.next=30;break;case 36:e.next=41;break;case 38:e.prev=38,e.t1=e.catch(27),x.e(e.t1);case 41:return e.prev=41,x.f(),e.finish(41);case 44:for(m=o+"/"+n.label.replace(/\//," ")+".html",g=0;a[m];)m=o+"/"+n.label.replace(/\//," ")+"_"+g+".html",g++;return a[m]=!0,e.next=50,Promise.all(c);case 50:y=Object(j.a)(r.getElementsByTagName("*"));try{for(y.s();!(w=y.n()).done;)w.value.removeAttribute("style")}catch(b){y.e(b)}finally{y.f()}if(i.html&&s.write({name:m,stream:function(){return new Response(r.documentElement.outerHTML).body}}),!i.markdown){e.next=66;break}e.prev=54,N=m.replace(/\.html$/,".md"),A=new k.a.Converter,E="",r&&r.body?E=A.makeMarkdown(r.body.innerHTML,r):console.log(r),E&&s.write({name:N,stream:function(){return new Response(E).body}}),e.next=66;break;case 62:return e.prev=62,e.t2=e.catch(54),console.log(e.t2),e.abrupt("return",!0);case 66:return e.abrupt("return",!0);case 67:case"end":return e.stop()}}),e,null,[[7,18,21,24],[27,38,41,44],[54,62]])})))).apply(this,arguments)}function q(e,t,n){return G.apply(this,arguments)}function G(){return(G=Object(f.a)(b.a.mark((function e(t,n,r){var a,s,i,c,o,u,l,p,h,d,f;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=L(t),m.a.WritableStream=g.b,i=new v.a,c=i.readable,o=i.writable,s=o.getWriter(),u=m.a.createWriteStream("onenote-export.zip"),c.pipeTo(u),l=[],p={},h=Object(j.a)(n),e.prev=9,f=function(){var e=d.value;if(!e.contentURL)return"continue";l.push(a.api(e.contentURL).get().then((function(n){return z(t,e,n,p,s,r)})).then())},h.s();case 12:if((d=h.n()).done){e.next=18;break}if("continue"!==f()){e.next=16;break}return e.abrupt("continue",16);case 16:e.next=12;break;case 18:e.next=23;break;case 20:e.prev=20,e.t0=e.catch(9),h.e(e.t0);case 23:return e.prev=23,h.f(),e.finish(23);case 26:return e.next=28,Promise.all(l);case 28:s.close();case 29:case"end":return e.stop()}}),e,null,[[9,20,23,26]])})))).apply(this,arguments)}var H=n(214),W={appId:"b92f9379-9e28-4076-9ba1-5546b988b1b6",redirectUri:"https://sspeiser.github.io/onenote-export",scopes:["user.read","notes.read"]};function J(e){return function(t){Object(p.a)(a,t);var n=Object(h.a)(a);function a(e){var t;return Object(u.a)(this,a),(t=n.call(this,e)).publicClientApplication=void 0,t.state={error:null,isAuthenticated:!1,user:{}},t.publicClientApplication=new H.a({auth:{clientId:W.appId,redirectUri:W.redirectUri},cache:{cacheLocation:"sessionStorage",storeAuthStateInCookie:!0}}),t}return Object(l.a)(a,[{key:"componentDidMount",value:function(){var e=this.publicClientApplication.getAllAccounts();e&&e.length>0&&this.getUserProfile()}},{key:"render",value:function(){var t=this;return Object(r.jsx)(e,Object(o.a)(Object(o.a)({login:function(){return t.login()},logout:function(){return t.logout()},getAccessToken:function(e){return t.getAccessToken(e)},setError:function(e,n){return t.setErrorMessage(e,n)}},this.props),this.state))}},{key:"login",value:function(){var e=Object(f.a)(b.a.mark((function e(){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.publicClientApplication.loginPopup({scopes:W.scopes,prompt:"select_account"});case 3:return e.next=5,this.getUserProfile();case 5:e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),this.setState({isAuthenticated:!1,user:{},error:this.normalizeError(e.t0)});case 10:case"end":return e.stop()}}),e,this,[[0,7]])})));return function(){return e.apply(this,arguments)}}()},{key:"logout",value:function(){this.publicClientApplication.logout()}},{key:"getAccessToken",value:function(){var e=Object(f.a)(b.a.mark((function e(t){var n,r,a;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,!((n=this.publicClientApplication.getAllAccounts()).length<=0)){e.next=4;break}throw new Error("login_required");case 4:return e.next=6,this.publicClientApplication.acquireTokenSilent({scopes:t,account:n[0]});case 6:return r=e.sent,e.abrupt("return",r.accessToken);case 10:if(e.prev=10,e.t0=e.catch(0),!this.isInteractionRequired(e.t0)){e.next=19;break}return e.next=15,this.publicClientApplication.acquireTokenPopup({scopes:t});case 15:return a=e.sent,e.abrupt("return",a.accessToken);case 19:throw e.t0;case 20:case"end":return e.stop()}}),e,this,[[0,10]])})));return function(t){return e.apply(this,arguments)}}()},{key:"getUserProfile",value:function(){var e=Object(f.a)(b.a.mark((function e(){var t,n;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.getAccessToken(W.scopes);case 3:if(!(t=e.sent)){e.next=9;break}return e.next=7,M(t);case 7:n=e.sent,this.setState({isAuthenticated:!0,user:{displayName:n.displayName,email:n.mail||n.userPrincipalName},error:null});case 9:e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),this.setState({isAuthenticated:!1,user:{},error:this.normalizeError(e.t0)});case 14:case"end":return e.stop()}}),e,this,[[0,11]])})));return function(){return e.apply(this,arguments)}}()},{key:"setErrorMessage",value:function(e,t){this.setState({error:{message:e,debug:t}})}},{key:"normalizeError",value:function(e){var t={};if("string"===typeof e){var n=e.split("|");t=n.length>1?{message:n[1],debug:n[0]}:{message:e}}else t={message:e.message,debug:JSON.stringify(e)};return t}},{key:"isInteractionRequired",value:function(e){return!(!e.message||e.message.length<=0)&&(e.message.indexOf("consent_required")>-1||e.message.indexOf("interaction_required")>-1||e.message.indexOf("login_required")>-1||e.message.indexOf("no_account_in_silent_request")>-1)}}]),a}(s.a.Component)}var D=n(56),X=n(15),F=n(407),Y=n(42),$=n(414),V=n(415),Z=n(416),K=n(404),Q=n(405),ee=n(215),te=n(406),ne=n(408),re=n(409),ae=n(410),se=n(411),ie=n(412);n(352);function ce(e){return e.user.avatar?Object(r.jsx)("img",{src:e.user.avatar,alt:"user",className:"rounded-circle align-self-center mr-2",style:{width:"32px"}}):Object(r.jsx)("i",{className:"far fa-user-circle fa-lg rounded-circle align-self-center mr-2",style:{width:"32px"}})}function oe(e){return e.isAuthenticated?Object(r.jsxs)($.a,{children:[Object(r.jsx)(V.a,{nav:!0,caret:!0,children:Object(r.jsx)(ce,{user:e.user})}),Object(r.jsxs)(Z.a,{right:!0,children:[Object(r.jsx)("h5",{className:"dropdown-item-text mb-0",children:e.user.displayName}),Object(r.jsx)("p",{className:"dropdown-item-text text-muted mb-0",children:e.user.email}),Object(r.jsx)(K.a,{divider:!0}),Object(r.jsx)(K.a,{onClick:e.authButtonMethod,children:"Sign Out"})]})]}):Object(r.jsx)(Q.a,{children:Object(r.jsx)(ee.a,{onClick:e.authButtonMethod,className:"btn-link nav-link border-0",color:"link",children:"Sign In"})})}var ue=function(e){Object(p.a)(n,e);var t=Object(h.a)(n);function n(e){var r;return Object(u.a)(this,n),(r=t.call(this,e)).toggle=r.toggle.bind(Object(Y.a)(r)),r.state={isOpen:!1},r}return Object(l.a)(n,[{key:"toggle",value:function(){this.setState({isOpen:!this.state.isOpen})}},{key:"render",value:function(){var e=null;return this.props.isAuthenticated&&(e=Object(r.jsx)(Q.a,{children:Object(r.jsx)(D.b,{to:"./notes",className:"nav-link",exact:!0,children:"Notes"})})),Object(r.jsx)("div",{children:Object(r.jsx)(te.a,{color:"dark",dark:!0,expand:"md",fixed:"top",children:Object(r.jsxs)(F.a,{children:[Object(r.jsx)(ne.a,{href:"./",children:"OneNote Export"}),Object(r.jsx)(re.a,{onClick:this.toggle}),Object(r.jsxs)(ae.a,{isOpen:this.state.isOpen,navbar:!0,children:[Object(r.jsxs)(se.a,{className:"mr-auto",navbar:!0,children:[Object(r.jsx)(Q.a,{children:Object(r.jsx)(D.b,{to:"./",className:"nav-link",exact:!0,children:"Home"})}),e]}),Object(r.jsxs)(se.a,{className:"justify-content-end",navbar:!0,children:[Object(r.jsx)(Q.a,{children:Object(r.jsxs)(ie.a,{href:"https://paypal.me/mkaythx",target:"_blank",children:[Object(r.jsx)("i",{className:"fas fa-external-link-alt mr-1"}),"Donate"]})}),Object(r.jsx)(Q.a,{children:Object(r.jsxs)(ie.a,{href:"https://github.com/sspeiser/onenote-export",target:"_blank",children:[Object(r.jsx)("i",{className:"fas fa-external-link-alt mr-1"}),"Support and Source Code"]})}),Object(r.jsx)(oe,{isAuthenticated:this.props.isAuthenticated,authButtonMethod:this.props.authButtonMethod,user:this.props.user})]})]})]})})})}}]),n}(s.a.Component),le=n(417),pe=function(e){Object(p.a)(n,e);var t=Object(h.a)(n);function n(){return Object(u.a)(this,n),t.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){var e=null;return this.props.debug&&(e=Object(r.jsx)("pre",{className:"alert-pre border bg-light p-2",children:Object(r.jsx)("code",{children:this.props.debug})})),Object(r.jsxs)(le.a,{color:"danger",children:[Object(r.jsx)("p",{className:"mb-3",children:this.props.message}),e]})}}]),n}(s.a.Component),he=n(413);function de(e){return e.isAuthenticated?Object(r.jsxs)("div",{children:[Object(r.jsxs)("h4",{children:["You are logged in as ",e.user.displayName,"!"]}),Object(r.jsx)("p",{children:"Choose the notes link in the navigation bar at the top of the page to get started with exporting."}),Object(r.jsx)(D.b,{to:"./notes",className:"nav-link",exact:!0,children:"Or just click here to get started"})]}):Object(r.jsx)(ee.a,{color:"primary",onClick:e.authButtonMethod,children:"Before you can export your notes you have to sign into your Microsoft account"})}var be=function(e){Object(p.a)(n,e);var t=Object(h.a)(n);function n(){return Object(u.a)(this,n),t.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){return Object(r.jsxs)(he.a,{children:[Object(r.jsx)("h1",{children:"OneNote Export"}),Object(r.jsx)("p",{className:"lead",children:"This app exports your OneNote notes from Microsoft 365 as a zip file containing your notes in html or markdown format and any embedded images and files."}),Object(r.jsx)("p",{children:"This app is free and respecting your privacy in the following ways"}),Object(r.jsxs)("ul",{children:[Object(r.jsx)("li",{children:"Free of charge: no payment is required, no matter how much data you want to export"}),Object(r.jsx)("li",{children:"No data collection: no data is collected about you, your login data or your notes - in fact your notes are processed only in your browser and never touch any of our servers. We don't have tracking software in this page."}),Object(r.jsx)("li",{children:"No advertisments: well ... no advertisments"}),Object(r.jsx)("li",{children:"Open Source: source code is available, please refer to link in navigation bar at the top of the page"}),Object(r.jsx)("li",{children:"No warranty and support: this app only requests read rights and so is not able to change your OneNote data, however there are no warranties and support is provided at GitHub on a best effort base"})]}),Object(r.jsx)("p",{children:"Your support in the form of donations is very much appreciated"}),Object(r.jsxs)("ul",{children:[Object(r.jsx)("li",{children:Object(r.jsx)("a",{href:"https://paypal.me/mkaythx",target:"_blank",rel:"noreferrer",children:"PayPal"})}),Object(r.jsxs)("li",{children:["BitCoin: 19ekwnds6jd9YwWtZ3H5W6iC96jFape5At",Object(r.jsx)("br",{})," ",Object(r.jsx)("img",{src:"bitcoin.png",width:"100",alt:""})]})]}),Object(r.jsx)(de,{isAuthenticated:this.props.isAuthenticated,user:this.props.user,authButtonMethod:this.props.authButtonMethod})]})}}]),n}(s.a.Component),fe=n(137),je=n.n(fe),xe=n(219),ve=n.n(xe),Oe=n(59),me=n(220),ge=Object(me.a)(g.a),ye=function(){function e(t){var n=this;Object(u.a)(this,e),this.writer=t,this.result=void 0,this.resolve=void 0,this.encoder=void 0,this.result=new Promise((function(e){return n.resolve=e})),this.encoder=new TextEncoder}return Object(l.a)(e,[{key:"write",value:function(e){var t=this;return this.writer.ready.then((function(){return t.writer.write(t.encoder.encode(e))}))}},{key:"close",value:function(){var e=this;return new Promise((function(t){e.writer.ready.then((function(){e.writer.close().then((function(){e.resolve&&e.resolve(),t()}))}))}))}}]),e}();function ke(e,t,n){return we.apply(this,arguments)}function we(){return(we=Object(f.a)(b.a.mark((function e(t,n,r){var a,s,i,c,o,u,l,p,h;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r.enex){e.next=2;break}return e.abrupt("return");case 2:m.a.WritableStream=g.b,a=m.a.createWriteStream("onenote-export.enex"),s=a.getWriter(),i=new ye(s),c=new Oe.EnexDumperOptions,o=new Oe.EnexDumper(i,c),u=[],l=Object(j.a)(n);try{for(l.s();!(p=l.n()).done;)h=p.value,u.push(Ne(t,h,r).then(o.next.bind(o)))}catch(d){l.e(d)}finally{l.f()}return e.next=13,Promise.all(u);case 13:return o.complete(),e.next=16,o.done;case 16:return e.next=18,i.result;case 18:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Ne(e,t,n){return Ae.apply(this,arguments)}function Ae(){return(Ae=Object(f.a)(b.a.mark((function e(t,n,r){var a,s,i,c,o,u,l,p,h,d,f,x,v,O,m,g,y,k,w,N,A,E,S,C,P,R;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=L(t),n.contentURL){e.next=3;break}return e.abrupt("return",Object(Oe.createNote)({title:n.label}));case 3:return e.next=5,a.api(n.contentURL).get();case 5:s=e.sent,i=[],c=[],o=Object(j.a)(s.getElementsByTagName("img"));try{for(o.s();!(u=o.n()).done;)l=u.value,c.push(l)}catch(r){o.e(r)}finally{o.f()}p=0,h=c;case 11:if(!(p<h.length)){e.next=27;break}if(d=h[p],f=d.getAttribute("data-fullres-src")||d.getAttribute("src")){e.next=16;break}return e.abrupt("continue",24);case 16:return x=d.getAttribute("data-fullres-src-type")||d.getAttribute("data-src-type")||"",f.split(/\//).slice(0,-1).pop(),v=x.split(/\//).pop(),O={url:f,filename:d.src.split("/").pop()+"."+v,mimetype:x,width:d.width||void 0,height:d.height||void 0},m=Object(Oe.createResource)(O),e.next=23,Ee(t)(m);case 23:i.push(m);case 24:p++,e.next=11;break;case 27:for(g=[],y=s.getElementsByTagName("object"),k=0;k<y.length;k++)(w=y.item(k))&&g.push(w);N=0,A=g;case 31:if(!(N<A.length)){e.next=46;break}if((E=A[N]).hasAttribute("data")){e.next=35;break}return e.abrupt("continue",43);case 35:if(E.hasAttribute("type")){e.next=37;break}return e.abrupt("continue",43);case 37:return S=E.type.split(/\//).pop(),C={url:E.data,filename:E.data.split("/").pop()+"."+S,mimetype:E.type},P=Object(Oe.createResource)(C),e.next=42,Ee(t)(P);case 42:i.push(P);case 43:N++,e.next=31;break;case 46:return R={title:n.label||"No title",tags:[n.notebook+"."+("."===n.sectionGroup?"":n.sectionGroup+".")+n.section],author:null,content:s,resources:i,created:null,updated:null},e.abrupt("return",Object(Oe.createNote)(R));case 48:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Ee(e){var t=L(e);return function(){var e=Object(f.a)(b.a.mark((function e(n){var r,a;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n.url){e.next=2;break}return e.abrupt("return",new Response("").body);case 2:return e.next=4,t.api(n.url).getStream();case 4:r=e.sent;try{(a=ge(r))instanceof g.a?n.dataStream=a:n.dataStream=r}catch(s){console.log(s)}case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}var Se=J(function(e){Object(p.a)(n,e);var t=Object(h.a)(n);function n(e){var r;return Object(u.a)(this,n),(r=t.call(this,e)).selectedPages=[],r.state={notesLoaded:!1,notesExporting:!1,tree:[]},r.exportNotes=r.exportNotes.bind(Object(Y.a)(r)),r.onChange=r.onChange.bind(Object(Y.a)(r)),r}return Object(l.a)(n,[{key:"onChange",value:function(e,t){var n,r=function e(t,n){var r,a=Object(j.a)(t);try{for(a.s();!(r=a.n()).done;){var s=r.value;if(s.id===n)return s;if(s.children){var i=e(s.children,n);if(null!=i)return i}}}catch(c){a.e(c)}finally{a.f()}},a=[],s=Object(j.a)(t);try{for(s.s();!(n=s.n()).done;){var i=n.value;a.push(r(this.state.tree,i.id))}}catch(o){s.e(o)}finally{s.f()}var c=[];!function e(t,n){var r,a=Object(j.a)(t);try{for(a.s();!(r=a.n()).done;){var s=r.value;s.children?e(s.children,n):n.push(s)}}catch(o){a.e(o)}finally{a.f()}}(a,c),this.selectedPages=c}},{key:"exportNotes",value:function(){var e=Object(f.a)(b.a.mark((function e(){var t,n,r,a,s=this;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.setState({notesExporting:!0}),console.log("Exporting ..."),t=Object(j.a)(this.selectedPages);try{for(t.s();!(n=t.n()).done;)r=n.value,console.log("... "+r.label+"  "+r.contentURL)}catch(i){t.e(i)}finally{t.f()}a={markdown:!0,html:!0,resources:!1,images:!1,enex:!1},q(this.props.getAccessToken(W.scopes),this.selectedPages,a).catch((function(e){return s.props.setError("ERROR",JSON.stringify(e))})).finally((function(){return s.setState({notesExporting:!1})}));case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"exportNotesEnex",value:function(){var e=Object(f.a)(b.a.mark((function e(){var t,n,r,a,s=this;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.setState({notesExporting:!0}),console.log("Exporting ..."),t=Object(j.a)(this.selectedPages);try{for(t.s();!(n=t.n()).done;)r=n.value,console.log("... "+r.label+"  "+r.contentURL)}catch(i){t.e(i)}finally{t.f()}a={markdown:!1,html:!0,resources:!0,images:!0,enex:!0},ke(this.props.getAccessToken(W.scopes),this.selectedPages,a).catch((function(e){return s.props.setError("ERROR",JSON.stringify(e))})).finally((function(){return s.setState({notesExporting:!1})}));case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidUpdate",value:function(){var e=Object(f.a)(b.a.mark((function e(){var t,n;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.state.notesLoaded){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,e.next=5,this.props.getAccessToken(W.scopes);case 5:return t=e.sent,e.next=8,R(t);case 8:n=e.sent,this.setState({notesLoaded:!0,tree:n}),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(2),this.props.setError("ERROR",JSON.stringify(e.t0));case 15:case"end":return e.stop()}}),e,this,[[2,12]])})));return function(){return e.apply(this,arguments)}}()},{key:"waiting",value:function(){return Object(r.jsxs)("div",{children:[Object(r.jsx)("p",{children:"Loading your notebooks ... this can take a while"}),Object(r.jsx)("p",{children:Object(r.jsx)(je.a,{css:"border-color: black; border: 2px;",size:50,color:"blue",loading:!this.state.notesLoaded})})]})}},{key:"exporting",value:function(){return Object(r.jsxs)("div",{children:[Object(r.jsx)("p",{children:"Exporting your notebooks ... this can take a while"}),Object(r.jsx)("p",{children:Object(r.jsx)(je.a,{css:"border-color: black; border: 2px;",size:50,color:"blue",loading:!this.state.notesExporting})})]})}},{key:"done",value:function(){return Object(r.jsxs)("div",{children:[Object(r.jsx)(ve.a,{data:this.state.tree,showDropdown:"initial",showPartiallySelected:!0,onChange:this.onChange,className:"mdl-demo"}),Object(r.jsxs)(ee.a,{color:"primary",onClick:this.exportNotes.bind(this),children:["Export your notes as a zip file",Object(r.jsx)("br",{})," containing HTML files and resources"]})," \xa0 \xa0 \xa0",Object(r.jsx)("br",{}),Object(r.jsx)("br",{}),Object(r.jsxs)(ee.a,{color:"primary",onClick:this.exportNotesEnex.bind(this),children:["Export your notes as ENEX-File - ",Object(r.jsx)("br",{}),"Evernote export format that can be",Object(r.jsx)("br",{})," imported into many note applications"]}),Object(r.jsx)("br",{}),Object(r.jsx)("br",{}),"How to proceed from here depends on which tool you want to use in the future:",Object(r.jsx)("br",{}),Object(r.jsxs)("ul",{children:[Object(r.jsxs)("li",{children:["General purpose editor (e.g. Atom, Visual Studio Code): download zip and open directory in your editor. Maybe convert HTML files to markdown, e.g. using ",Object(r.jsx)("a",{href:"https://pandoc.org/demos.html",target:"_blank",rel:"noreferrer",children:"pandoc, see example 12"})]}),Object(r.jsx)("li",{children:"Standard Notes: both ENEX and zip should be importable via the provided tools. It will not import resources."}),Object(r.jsx)("li",{children:"Evernote: download ENEX and import in desktop application. Some resources and images might be damaged."}),Object(r.jsx)("li",{children:"Joplin: download ENEX and import as Markdown. Sections will be converted to tags. As an alternative you can download the zip, unzip it and import the HTML directory"}),Object(r.jsx)("li",{children:"Anything else: download both and see which one imports better"})]})]})}},{key:"render",value:function(){return Object(r.jsxs)("div",{children:[Object(r.jsx)("h4",{children:"Select Notebooks, Sections, Pages to export"}),this.state.notesLoaded?this.state.notesExporting?this.exporting():this.done():this.waiting()]})}}]),n}(s.a.Component)),Ce=(n(201),J(function(e){Object(p.a)(n,e);var t=Object(h.a)(n);function n(){return Object(u.a)(this,n),t.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){var e=this,t=null;return this.props.error&&(t=Object(r.jsx)(pe,{message:this.props.error.message,debug:this.props.error.debug})),Object(r.jsx)(D.a,{children:Object(r.jsxs)("div",{children:[Object(r.jsx)(ue,{isAuthenticated:this.props.isAuthenticated,authButtonMethod:this.props.isAuthenticated?this.props.logout:this.props.login,user:this.props.user}),Object(r.jsxs)(F.a,{children:[t,Object(r.jsx)(X.b,{exact:!0,path:"./",render:function(t){return Object(r.jsx)(be,Object(o.a)(Object(o.a)({},t),{},{isAuthenticated:e.props.isAuthenticated,user:e.props.user,authButtonMethod:e.props.login}))}}),Object(r.jsx)(X.b,{exact:!0,path:"./notes",render:function(t){return e.props.isAuthenticated?Object(r.jsx)(Se,Object(o.a)({},t)):Object(r.jsx)(X.a,{to:"./"})}})]})]})})}}]),n}(a.Component)));c.a.render(Object(r.jsx)(s.a.StrictMode,{children:Object(r.jsx)(Ce,{})}),document.getElementById("root"))}},[[402,1,2]]]);
//# sourceMappingURL=main.700d55ba.chunk.js.map