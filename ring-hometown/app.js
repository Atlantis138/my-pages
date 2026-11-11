"use strict";(()=>{var th=0,_l=1,nh=2;var qs=1,ih=2,fs=3,Xn=0,Jt=1,In=2,hn=0,Ai=1,Zn=2,yl=3,Ml=4,ya=5;var Tn=100,sh=101,rh=102,ah=103,oh=104,lh=200,Ys=201,ch=202,hh=203,Gr=204,Vr=205,uh=206,fh=207,dh=208,ph=209,mh=210,gh=211,vh=212,xh=213,_h=214,Hr=0,Wr=1,Xr=2,Ei=3,qr=4,Yr=5,Zr=6,Kr=7,bl=0,yh=1,Mh=2,un=0,Sl=1,wl=2,Tl=3,Al=4,El=5,Cl=6,Rl=7;var Pl=300,di=301,Pi=302,Ma=303,ba=304,Zs=306,os=1e3,Yt=1001,$r=1002,xt=1003,bh=1004;var Ks=1005;var et=1006,Sa=1007;var Dn=1008;var Ut=1009,Il=1010,Dl=1011,ds=1012,wa=1013,yn=1014,Vt=1015,Pt=1016,Ta=1017,Aa=1018,ps=1020,Ll=35902,Fl=35899,Nl=1021,Ul=1022,Mt=1023,An=1026,pi=1027,Ii=1028,Ea=1029,Kn=1030,Ca=1031;var Ra=1033,$s=33776,Js=33777,js=33778,Qs=33779,Pa=35840,Ia=35841,Da=35842,La=35843,Fa=36196,Na=37492,Ua=37496,Oa=37488,Ba=37489,za=37490,ka=37491,Ga=37808,Va=37809,Ha=37810,Wa=37811,Xa=37812,qa=37813,Ya=37814,Za=37815,Ka=37816,$a=37817,Ja=37818,ja=37819,Qa=37820,eo=37821,to=36492,no=36494,io=36495,so=36283,ro=36284,ao=36285,oo=36286;var Cs=2300,Jr=2301,kr=2302,ul=2303,fl=2400,dl=2401,pl=2402;var Sh=3200;var wh=0,Th=1,$n="",an="srgb",qn="srgb-linear",Rs="linear",ct="srgb";var wi=7680;var ml=519,Ah=512,Eh=513,Ch=514,lo=515,Rh=516,Ph=517,co=518,Ih=519,gl=35044;var Ol="300 es",_n=2e3,Ps=2001;function Sf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function wf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Is(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Dh(){let i=Is("canvas");return i.style.display="block",i}var Uc={},ls=null;function Bl(...i){let e="THREE."+i.shift();ls?ls("log",e,...i):console.log(e,...i)}function Lh(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function ke(...i){i=Lh(i);let e="THREE."+i.shift();if(ls)ls("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function ze(...i){i=Lh(i);let e="THREE."+i.shift();if(ls)ls("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Ds(...i){let e=i.join(" ");e in Uc||(Uc[e]=!0,ke(...i))}function Fh(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Nh={[Hr]:Wr,[Xr]:Zr,[qr]:Kr,[Ei]:Yr,[Wr]:Hr,[Zr]:Xr,[Kr]:qr,[Yr]:Ei},Yn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Vo=Math.PI/180,jr=180/Math.PI;function er(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[t&63|128]+Wt[t>>8&255]+"-"+Wt[t>>16&255]+Wt[t>>24&255]+Wt[n&255]+Wt[n>>8&255]+Wt[n>>16&255]+Wt[n>>24&255]).toLowerCase()}function Qe(i,e,t){return Math.max(e,Math.min(t,i))}function Tf(i,e){return(i%e+e)%e}function Ho(i,e,t){return(1-t)*i+t*e}function Ss(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function jt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Xe=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},En=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],p=n[s+3],u=r[a+0],m=r[a+1],v=r[a+2],g=r[a+3];if(p!==g||l!==u||c!==m||h!==v){let f=l*u+c*m+h*v+p*g;f<0&&(u=-u,m=-m,v=-v,g=-g,f=-f);let d=1-o;if(f<.9995){let x=Math.acos(f),M=Math.sin(x);d=Math.sin(d*x)/M,o=Math.sin(o*x)/M,l=l*d+u*o,c=c*d+m*o,h=h*d+v*o,p=p*d+g*o}else{l=l*d+u*o,c=c*d+m*o,h=h*d+v*o,p=p*d+g*o;let x=1/Math.sqrt(l*l+c*c+h*h+p*p);l*=x,c*=x,h*=x,p*=x}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=p}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],p=r[a],u=r[a+1],m=r[a+2],v=r[a+3];return e[t]=o*v+h*p+l*m-c*u,e[t+1]=l*v+h*u+c*p-o*m,e[t+2]=c*v+h*m+o*u-l*p,e[t+3]=h*v-o*p-l*u-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),p=o(r/2),u=l(n/2),m=l(s/2),v=l(r/2);switch(a){case"XYZ":this._x=u*h*p+c*m*v,this._y=c*m*p-u*h*v,this._z=c*h*v+u*m*p,this._w=c*h*p-u*m*v;break;case"YXZ":this._x=u*h*p+c*m*v,this._y=c*m*p-u*h*v,this._z=c*h*v-u*m*p,this._w=c*h*p+u*m*v;break;case"ZXY":this._x=u*h*p-c*m*v,this._y=c*m*p+u*h*v,this._z=c*h*v+u*m*p,this._w=c*h*p-u*m*v;break;case"ZYX":this._x=u*h*p-c*m*v,this._y=c*m*p+u*h*v,this._z=c*h*v-u*m*p,this._w=c*h*p+u*m*v;break;case"YZX":this._x=u*h*p+c*m*v,this._y=c*m*p+u*h*v,this._z=c*h*v-u*m*p,this._w=c*h*p-u*m*v;break;case"XZY":this._x=u*h*p-c*m*v,this._y=c*m*p-u*h*v,this._z=c*h*v+u*m*p,this._w=c*h*p+u*m*v;break;default:ke("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],p=t[10],u=n+o+p;if(u>0){let m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>p){let m=2*Math.sqrt(1+n-o-p);this._w=(h-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>p){let m=2*Math.sqrt(1+o-n-p);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+p-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Oc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Oc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),p=2*(r*n-a*t);return this.x=t+l*c+a*p-o*h,this.y=n+l*h+o*c-r*p,this.z=s+l*p+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Wo.copy(this).projectOnVector(e),this.sub(Wo)}reflect(e){return this.sub(Wo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Wo=new D,Oc=new En,Ye=class i{constructor(e,t,n,s,r,a,o,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],p=n[7],u=n[2],m=n[5],v=n[8],g=s[0],f=s[3],d=s[6],x=s[1],M=s[4],b=s[7],A=s[2],w=s[5],C=s[8];return r[0]=a*g+o*x+l*A,r[3]=a*f+o*M+l*w,r[6]=a*d+o*b+l*C,r[1]=c*g+h*x+p*A,r[4]=c*f+h*M+p*w,r[7]=c*d+h*b+p*C,r[2]=u*g+m*x+v*A,r[5]=u*f+m*M+v*w,r[8]=u*d+m*b+v*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],p=h*a-o*c,u=o*l-h*r,m=c*r-a*l,v=t*p+n*u+s*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/v;return e[0]=p*g,e[1]=(s*c-h*n)*g,e[2]=(o*n-s*a)*g,e[3]=u*g,e[4]=(h*t-s*l)*g,e[5]=(s*r-o*t)*g,e[6]=m*g,e[7]=(n*l-c*t)*g,e[8]=(a*t-n*r)*g,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Xo.makeScale(e,t)),this}rotate(e){return this.premultiply(Xo.makeRotation(-e)),this}translate(e,t){return this.premultiply(Xo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Xo=new Ye,Bc=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zc=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Af(){let i={enabled:!0,workingColorSpace:qn,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ct&&(s.r=Wn(s.r),s.g=Wn(s.g),s.b=Wn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ct&&(s.r=as(s.r),s.g=as(s.g),s.b=as(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===$n?Rs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ds("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ds("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[qn]:{primaries:e,whitePoint:n,transfer:Rs,toXYZ:Bc,fromXYZ:zc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:an},outputColorSpaceConfig:{drawingBufferColorSpace:an}},[an]:{primaries:e,whitePoint:n,transfer:ct,toXYZ:Bc,fromXYZ:zc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:an}}}),i}var nt=Af();function Wn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function as(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Zi,Qr=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Zi===void 0&&(Zi=Is("canvas")),Zi.width=e.width,Zi.height=e.height;let s=Zi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Zi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Is("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Wn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Wn(t[n]/255)*255):t[n]=Wn(t[n]);return{data:t,width:e.width,height:e.height}}else return ke("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Ef=0,cs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=er(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(qo(s[a].image)):r.push(qo(s[a]))}else r=qo(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function qo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Qr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(ke("Texture: Unable to serialize Texture."),{})}var Cf=0,Yo=new D,Qt=class i extends Yn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Yt,s=Yt,r=et,a=Dn,o=Mt,l=Ut,c=i.DEFAULT_ANISOTROPY,h=$n){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Cf++}),this.uuid=er(),this.name="",this.source=new cs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Xe(0,0),this.repeat=new Xe(1,1),this.center=new Xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Yo).x}get height(){return this.source.getSize(Yo).y}get depth(){return this.source.getSize(Yo).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){ke(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){ke(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Pl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case os:e.x=e.x-Math.floor(e.x);break;case Yt:e.x=e.x<0?0:1;break;case $r:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case os:e.y=e.y-Math.floor(e.y);break;case Yt:e.y=e.y<0?0:1;break;case $r:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Qt.DEFAULT_IMAGE=null;Qt.DEFAULT_MAPPING=Pl;Qt.DEFAULT_ANISOTROPY=1;var Je=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],p=l[8],u=l[1],m=l[5],v=l[9],g=l[2],f=l[6],d=l[10];if(Math.abs(h-u)<.01&&Math.abs(p-g)<.01&&Math.abs(v-f)<.01){if(Math.abs(h+u)<.1&&Math.abs(p+g)<.1&&Math.abs(v+f)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(c+1)/2,b=(m+1)/2,A=(d+1)/2,w=(h+u)/4,C=(p+g)/4,_=(v+f)/4;return M>b&&M>A?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=w/n,r=C/n):b>A?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=w/s,r=_/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=C/r,s=_/r),this.set(n,s,r,t),this}let x=Math.sqrt((f-v)*(f-v)+(p-g)*(p-g)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(f-v)/x,this.y=(p-g)/x,this.z=(u-h)/x,this.w=Math.acos((c+m+d-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this.w=Qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this.w=Qe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ea=class extends Yn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:et,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Je(0,0,e,t),this.scissorTest=!1,this.viewport=new Je(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new Qt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:et,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new cs(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},yt=class extends ea{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ls=class extends Qt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=xt,this.minFilter=xt,this.wrapR=Yt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ta=class extends Qt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=xt,this.minFilter=xt,this.wrapR=Yt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ht=class i{constructor(e,t,n,s,r,a,o,l,c,h,p,u,m,v,g,f){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,p,u,m,v,g,f)}set(e,t,n,s,r,a,o,l,c,h,p,u,m,v,g,f){let d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=p,d[14]=u,d[3]=m,d[7]=v,d[11]=g,d[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();let t=this.elements,n=e.elements,s=1/Ki.setFromMatrixColumn(e,0).length(),r=1/Ki.setFromMatrixColumn(e,1).length(),a=1/Ki.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),p=Math.sin(r);if(e.order==="XYZ"){let u=a*h,m=a*p,v=o*h,g=o*p;t[0]=l*h,t[4]=-l*p,t[8]=c,t[1]=m+v*c,t[5]=u-g*c,t[9]=-o*l,t[2]=g-u*c,t[6]=v+m*c,t[10]=a*l}else if(e.order==="YXZ"){let u=l*h,m=l*p,v=c*h,g=c*p;t[0]=u+g*o,t[4]=v*o-m,t[8]=a*c,t[1]=a*p,t[5]=a*h,t[9]=-o,t[2]=m*o-v,t[6]=g+u*o,t[10]=a*l}else if(e.order==="ZXY"){let u=l*h,m=l*p,v=c*h,g=c*p;t[0]=u-g*o,t[4]=-a*p,t[8]=v+m*o,t[1]=m+v*o,t[5]=a*h,t[9]=g-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let u=a*h,m=a*p,v=o*h,g=o*p;t[0]=l*h,t[4]=v*c-m,t[8]=u*c+g,t[1]=l*p,t[5]=g*c+u,t[9]=m*c-v,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let u=a*l,m=a*c,v=o*l,g=o*c;t[0]=l*h,t[4]=g-u*p,t[8]=v*p+m,t[1]=p,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*p+v,t[10]=u-g*p}else if(e.order==="XZY"){let u=a*l,m=a*c,v=o*l,g=o*c;t[0]=l*h,t[4]=-p,t[8]=c*h,t[1]=u*p+g,t[5]=a*h,t[9]=m*p-v,t[2]=v*p-m,t[6]=o*h,t[10]=g*p+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Rf,e,Pf)}lookAt(e,t,n){let s=this.elements;return sn.subVectors(e,t),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),ti.crossVectors(n,sn),ti.lengthSq()===0&&(Math.abs(n.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),ti.crossVectors(n,sn)),ti.normalize(),xr.crossVectors(sn,ti),s[0]=ti.x,s[4]=xr.x,s[8]=sn.x,s[1]=ti.y,s[5]=xr.y,s[9]=sn.y,s[2]=ti.z,s[6]=xr.z,s[10]=sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],p=n[5],u=n[9],m=n[13],v=n[2],g=n[6],f=n[10],d=n[14],x=n[3],M=n[7],b=n[11],A=n[15],w=s[0],C=s[4],_=s[8],S=s[12],U=s[1],R=s[5],F=s[9],O=s[13],G=s[2],H=s[6],V=s[10],W=s[14],re=s[3],se=s[7],ge=s[11],ye=s[15];return r[0]=a*w+o*U+l*G+c*re,r[4]=a*C+o*R+l*H+c*se,r[8]=a*_+o*F+l*V+c*ge,r[12]=a*S+o*O+l*W+c*ye,r[1]=h*w+p*U+u*G+m*re,r[5]=h*C+p*R+u*H+m*se,r[9]=h*_+p*F+u*V+m*ge,r[13]=h*S+p*O+u*W+m*ye,r[2]=v*w+g*U+f*G+d*re,r[6]=v*C+g*R+f*H+d*se,r[10]=v*_+g*F+f*V+d*ge,r[14]=v*S+g*O+f*W+d*ye,r[3]=x*w+M*U+b*G+A*re,r[7]=x*C+M*R+b*H+A*se,r[11]=x*_+M*F+b*V+A*ge,r[15]=x*S+M*O+b*W+A*ye,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],p=e[6],u=e[10],m=e[14],v=e[3],g=e[7],f=e[11],d=e[15],x=l*m-c*u,M=o*m-c*p,b=o*u-l*p,A=a*m-c*h,w=a*u-l*h,C=a*p-o*h;return t*(g*x-f*M+d*b)-n*(v*x-f*A+d*w)+s*(v*M-g*A+d*C)-r*(v*b-g*w+f*C)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],p=e[9],u=e[10],m=e[11],v=e[12],g=e[13],f=e[14],d=e[15],x=t*o-n*a,M=t*l-s*a,b=t*c-r*a,A=n*l-s*o,w=n*c-r*o,C=s*c-r*l,_=h*g-p*v,S=h*f-u*v,U=h*d-m*v,R=p*f-u*g,F=p*d-m*g,O=u*d-m*f,G=x*O-M*F+b*R+A*U-w*S+C*_;if(G===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let H=1/G;return e[0]=(o*O-l*F+c*R)*H,e[1]=(s*F-n*O-r*R)*H,e[2]=(g*C-f*w+d*A)*H,e[3]=(u*w-p*C-m*A)*H,e[4]=(l*U-a*O-c*S)*H,e[5]=(t*O-s*U+r*S)*H,e[6]=(f*b-v*C-d*M)*H,e[7]=(h*C-u*b+m*M)*H,e[8]=(a*F-o*U+c*_)*H,e[9]=(n*U-t*F-r*_)*H,e[10]=(v*w-g*b+d*x)*H,e[11]=(p*b-h*w-m*x)*H,e[12]=(o*S-a*R-l*_)*H,e[13]=(t*R-n*S+s*_)*H,e[14]=(g*M-v*A-f*x)*H,e[15]=(h*A-p*M+u*x)*H,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,p=o+o,u=r*c,m=r*h,v=r*p,g=a*h,f=a*p,d=o*p,x=l*c,M=l*h,b=l*p,A=n.x,w=n.y,C=n.z;return s[0]=(1-(g+d))*A,s[1]=(m+b)*A,s[2]=(v-M)*A,s[3]=0,s[4]=(m-b)*w,s[5]=(1-(u+d))*w,s[6]=(f+x)*w,s[7]=0,s[8]=(v+M)*C,s[9]=(f-x)*C,s[10]=(1-(u+g))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinant();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Ki.set(s[0],s[1],s[2]).length(),o=Ki.set(s[4],s[5],s[6]).length(),l=Ki.set(s[8],s[9],s[10]).length();r<0&&(a=-a),gn.copy(this);let c=1/a,h=1/o,p=1/l;return gn.elements[0]*=c,gn.elements[1]*=c,gn.elements[2]*=c,gn.elements[4]*=h,gn.elements[5]*=h,gn.elements[6]*=h,gn.elements[8]*=p,gn.elements[9]*=p,gn.elements[10]*=p,t.setFromRotationMatrix(gn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=_n,l=!1){let c=this.elements,h=2*r/(t-e),p=2*r/(n-s),u=(t+e)/(t-e),m=(n+s)/(n-s),v,g;if(l)v=r/(a-r),g=a*r/(a-r);else if(o===_n)v=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Ps)v=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=p,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=v,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=_n,l=!1){let c=this.elements,h=2/(t-e),p=2/(n-s),u=-(t+e)/(t-e),m=-(n+s)/(n-s),v,g;if(l)v=1/(a-r),g=a/(a-r);else if(o===_n)v=-2/(a-r),g=-(a+r)/(a-r);else if(o===Ps)v=-1/(a-r),g=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=p,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=v,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Ki=new D,gn=new ht,Rf=new D(0,0,0),Pf=new D(1,1,1),ti=new D,xr=new D,sn=new D,kc=new ht,Gc=new En,Cn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],p=s[2],u=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,r),this._z=0);break;case"ZXY":this._x=Math.asin(Qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-p,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Qe(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-p,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:ke("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return kc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(kc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Gc.setFromEuler(this),this.setFromQuaternion(Gc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Cn.DEFAULT_ORDER="XYZ";var Fs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},If=0,Vc=new D,$i=new En,Bn=new ht,_r=new D,ws=new D,Df=new D,Lf=new En,Hc=new D(1,0,0),Wc=new D(0,1,0),Xc=new D(0,0,1),qc={type:"added"},Ff={type:"removed"},Ji={type:"childadded",child:null},Zo={type:"childremoved",child:null},on=class i extends Yn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:If++}),this.uuid=er(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new D,t=new Cn,n=new En,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ht},normalMatrix:{value:new Ye}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Fs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return $i.setFromAxisAngle(e,t),this.quaternion.multiply($i),this}rotateOnWorldAxis(e,t){return $i.setFromAxisAngle(e,t),this.quaternion.premultiply($i),this}rotateX(e){return this.rotateOnAxis(Hc,e)}rotateY(e){return this.rotateOnAxis(Wc,e)}rotateZ(e){return this.rotateOnAxis(Xc,e)}translateOnAxis(e,t){return Vc.copy(e).applyQuaternion(this.quaternion),this.position.add(Vc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Hc,e)}translateY(e){return this.translateOnAxis(Wc,e)}translateZ(e){return this.translateOnAxis(Xc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Bn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?_r.copy(e):_r.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ws.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bn.lookAt(ws,_r,this.up):Bn.lookAt(_r,ws,this.up),this.quaternion.setFromRotationMatrix(Bn),s&&(Bn.extractRotation(s.matrixWorld),$i.setFromRotationMatrix(Bn),this.quaternion.premultiply($i.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ze("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(qc),Ji.child=e,this.dispatchEvent(Ji),Ji.child=null):ze("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ff),Zo.child=e,this.dispatchEvent(Zo),Zo.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Bn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Bn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Bn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(qc),Ji.child=e,this.dispatchEvent(Ji),Ji.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ws,e,Df),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ws,Lf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let p=l[c];r(e.shapes,p)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),p=a(e.shapes),u=a(e.skeletons),m=a(e.animations),v=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),p.length>0&&(n.shapes=p),u.length>0&&(n.skeletons=u),m.length>0&&(n.animations=m),v.length>0&&(n.nodes=v)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};on.DEFAULT_UP=new D(0,1,0);on.DEFAULT_MATRIX_AUTO_UPDATE=!0;on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ti=class extends on{constructor(){super(),this.isGroup=!0,this.type="Group"}},Nf={type:"move"},hs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ti,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ti,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ti,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let g of e.hand.values()){let f=t.getJointPose(g,n),d=this._getHandJoint(c,g);f!==null&&(d.matrix.fromArray(f.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=f.radius),d.visible=f!==null}let h=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],u=h.position.distanceTo(p.position),m=.02,v=.005;c.inputState.pinching&&u>m+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=m-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Nf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Ti;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Uh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ni={h:0,s:0,l:0},yr={h:0,s:0,l:0};function Ko(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ot=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=an){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=nt.workingColorSpace){if(e=Tf(e,1),t=Qe(t,0,1),n=Qe(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Ko(a,r,e+1/3),this.g=Ko(a,r,e),this.b=Ko(a,r,e-1/3)}return nt.colorSpaceToWorking(this,s),this}setStyle(e,t=an){function n(r){r!==void 0&&parseFloat(r)<1&&ke("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:ke("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);ke("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=an){let n=Uh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):ke("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Wn(e.r),this.g=Wn(e.g),this.b=Wn(e.b),this}copyLinearToSRGB(e){return this.r=as(e.r),this.g=as(e.g),this.b=as(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=an){return nt.workingToColorSpace(Xt.copy(this),e),Math.round(Qe(Xt.r*255,0,255))*65536+Math.round(Qe(Xt.g*255,0,255))*256+Math.round(Qe(Xt.b*255,0,255))}getHexString(e=an){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.workingToColorSpace(Xt.copy(this),t);let n=Xt.r,s=Xt.g,r=Xt.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let p=a-o;switch(c=h<=.5?p/(a+o):p/(2-a-o),a){case n:l=(s-r)/p+(s<r?6:0);break;case s:l=(r-n)/p+2;break;case r:l=(n-s)/p+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=nt.workingColorSpace){return nt.workingToColorSpace(Xt.copy(this),t),e.r=Xt.r,e.g=Xt.g,e.b=Xt.b,e}getStyle(e=an){nt.workingToColorSpace(Xt.copy(this),e);let t=Xt.r,n=Xt.g,s=Xt.b;return e!==an?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ni),this.setHSL(ni.h+e,ni.s+t,ni.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ni),e.getHSL(yr);let n=Ho(ni.h,yr.h,t),s=Ho(ni.s,yr.s,t),r=Ho(ni.l,yr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Xt=new ot;ot.NAMES=Uh;var Zt=class extends on{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cn,this.environmentIntensity=1,this.environmentRotation=new Cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},vn=new D,zn=new D,$o=new D,kn=new D,ji=new D,Qi=new D,Yc=new D,Jo=new D,jo=new D,Qo=new D,el=new Je,tl=new Je,nl=new Je,oi=class i{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),vn.subVectors(e,t),s.cross(vn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){vn.subVectors(s,t),zn.subVectors(n,t),$o.subVectors(e,t);let a=vn.dot(vn),o=vn.dot(zn),l=vn.dot($o),c=zn.dot(zn),h=zn.dot($o),p=a*c-o*o;if(p===0)return r.set(0,0,0),null;let u=1/p,m=(c*l-o*h)*u,v=(a*h-o*l)*u;return r.set(1-m-v,v,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,kn)===null?!1:kn.x>=0&&kn.y>=0&&kn.x+kn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,kn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,kn.x),l.addScaledVector(a,kn.y),l.addScaledVector(o,kn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return el.setScalar(0),tl.setScalar(0),nl.setScalar(0),el.fromBufferAttribute(e,t),tl.fromBufferAttribute(e,n),nl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(el,r.x),a.addScaledVector(tl,r.y),a.addScaledVector(nl,r.z),a}static isFrontFacing(e,t,n,s){return vn.subVectors(n,t),zn.subVectors(e,t),vn.cross(zn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return vn.subVectors(this.c,this.b),zn.subVectors(this.a,this.b),vn.cross(zn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;ji.subVectors(s,n),Qi.subVectors(r,n),Jo.subVectors(e,n);let l=ji.dot(Jo),c=Qi.dot(Jo);if(l<=0&&c<=0)return t.copy(n);jo.subVectors(e,s);let h=ji.dot(jo),p=Qi.dot(jo);if(h>=0&&p<=h)return t.copy(s);let u=l*p-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(ji,a);Qo.subVectors(e,r);let m=ji.dot(Qo),v=Qi.dot(Qo);if(v>=0&&m<=v)return t.copy(r);let g=m*c-l*v;if(g<=0&&c>=0&&v<=0)return o=c/(c-v),t.copy(n).addScaledVector(Qi,o);let f=h*v-m*p;if(f<=0&&p-h>=0&&m-v>=0)return Yc.subVectors(r,s),o=(p-h)/(p-h+(m-v)),t.copy(s).addScaledVector(Yc,o);let d=1/(f+g+u);return a=g*d,o=u*d,t.copy(n).addScaledVector(ji,a).addScaledVector(Qi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},li=class{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(xn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(xn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=xn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,xn):xn.fromBufferAttribute(r,a),xn.applyMatrix4(e.matrixWorld),this.expandByPoint(xn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Mr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Mr.copy(n.boundingBox)),Mr.applyMatrix4(e.matrixWorld),this.union(Mr)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,xn),xn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ts),br.subVectors(this.max,Ts),es.subVectors(e.a,Ts),ts.subVectors(e.b,Ts),ns.subVectors(e.c,Ts),ii.subVectors(ts,es),si.subVectors(ns,ts),yi.subVectors(es,ns);let t=[0,-ii.z,ii.y,0,-si.z,si.y,0,-yi.z,yi.y,ii.z,0,-ii.x,si.z,0,-si.x,yi.z,0,-yi.x,-ii.y,ii.x,0,-si.y,si.x,0,-yi.y,yi.x,0];return!il(t,es,ts,ns,br)||(t=[1,0,0,0,1,0,0,0,1],!il(t,es,ts,ns,br))?!1:(Sr.crossVectors(ii,si),t=[Sr.x,Sr.y,Sr.z],il(t,es,ts,ns,br))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,xn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(xn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Gn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Gn=[new D,new D,new D,new D,new D,new D,new D,new D],xn=new D,Mr=new li,es=new D,ts=new D,ns=new D,ii=new D,si=new D,yi=new D,Ts=new D,br=new D,Sr=new D,Mi=new D;function il(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Mi.fromArray(i,r);let o=s.x*Math.abs(Mi.x)+s.y*Math.abs(Mi.y)+s.z*Math.abs(Mi.z),l=e.dot(Mi),c=t.dot(Mi),h=n.dot(Mi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Hn=Uf();function Uf(){let i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,s[l]=24,s[l|256]=24):(n[l]=31744,n[l|256]=64512,s[l]=13,s[l|256]=13)}let r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function Of(i){Math.abs(i)>65504&&ke("DataUtils.toHalfFloat(): Value out of range."),i=Qe(i,-65504,65504),Hn.floatView[0]=i;let e=Hn.uint32View[0],t=e>>23&511;return Hn.baseTable[t]+((e&8388607)>>Hn.shiftTable[t])}function Bf(i){let e=i>>10;return Hn.uint32View[0]=Hn.mantissaTable[Hn.offsetTable[e]+(i&1023)]+Hn.exponentTable[e],Hn.floatView[0]}var us=class{static toHalfFloat(e){return Of(e)}static fromHalfFloat(e){return Bf(e)}},Et=new D,wr=new Xe,zf=0,He=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:zf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=gl,this.updateRanges=[],this.gpuType=Vt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)wr.fromBufferAttribute(this,t),wr.applyMatrix3(e),this.setXY(t,wr.x,wr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix3(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix4(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyNormalMatrix(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.transformDirection(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ss(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=jt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ss(t,this.array)),t}setX(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ss(t,this.array)),t}setY(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ss(t,this.array)),t}setZ(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ss(t,this.array)),t}setW(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array),s=jt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array),s=jt(s,this.array),r=jt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==gl&&(e.usage=this.usage),e}};var Ns=class extends He{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Us=class extends He{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Ct=class extends He{constructor(e,t,n){super(new Float32Array(e),t,n)}},kf=new li,As=new D,sl=new D,St=class{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):kf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;As.subVectors(e,this.center);let t=As.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(As,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(sl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(As.copy(e.center).add(sl)),this.expandByPoint(As.copy(e.center).sub(sl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Gf=0,fn=new ht,rl=new on,is=new D,rn=new li,Es=new li,Nt=new D,lt=class i extends Yn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Gf++}),this.uuid=er(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Sf(e)?Us:Ns)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return fn.makeRotationFromQuaternion(e),this.applyMatrix4(fn),this}rotateX(e){return fn.makeRotationX(e),this.applyMatrix4(fn),this}rotateY(e){return fn.makeRotationY(e),this.applyMatrix4(fn),this}rotateZ(e){return fn.makeRotationZ(e),this.applyMatrix4(fn),this}translate(e,t,n){return fn.makeTranslation(e,t,n),this.applyMatrix4(fn),this}scale(e,t,n){return fn.makeScale(e,t,n),this.applyMatrix4(fn),this}lookAt(e){return rl.lookAt(e),rl.updateMatrix(),this.applyMatrix4(rl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(is).negate(),this.translate(is.x,is.y,is.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ct(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&ke("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new li);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ze("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];rn.setFromBufferAttribute(r),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,rn.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,rn.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(rn.min),this.boundingBox.expandByPoint(rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ze('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new St);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ze("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){let n=this.boundingSphere.center;if(rn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Es.setFromBufferAttribute(o),this.morphTargetsRelative?(Nt.addVectors(rn.min,Es.min),rn.expandByPoint(Nt),Nt.addVectors(rn.max,Es.max),rn.expandByPoint(Nt)):(rn.expandByPoint(Es.min),rn.expandByPoint(Es.max))}rn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Nt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Nt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Nt.fromBufferAttribute(o,c),l&&(is.fromBufferAttribute(e,c),Nt.add(is)),s=Math.max(s,n.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ze('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ze("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new He(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new D,l[_]=new D;let c=new D,h=new D,p=new D,u=new Xe,m=new Xe,v=new Xe,g=new D,f=new D;function d(_,S,U){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,S),p.fromBufferAttribute(n,U),u.fromBufferAttribute(r,_),m.fromBufferAttribute(r,S),v.fromBufferAttribute(r,U),h.sub(c),p.sub(c),m.sub(u),v.sub(u);let R=1/(m.x*v.y-v.x*m.y);isFinite(R)&&(g.copy(h).multiplyScalar(v.y).addScaledVector(p,-m.y).multiplyScalar(R),f.copy(p).multiplyScalar(m.x).addScaledVector(h,-v.x).multiplyScalar(R),o[_].add(g),o[S].add(g),o[U].add(g),l[_].add(f),l[S].add(f),l[U].add(f))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let _=0,S=x.length;_<S;++_){let U=x[_],R=U.start,F=U.count;for(let O=R,G=R+F;O<G;O+=3)d(e.getX(O+0),e.getX(O+1),e.getX(O+2))}let M=new D,b=new D,A=new D,w=new D;function C(_){A.fromBufferAttribute(s,_),w.copy(A);let S=o[_];M.copy(S),M.sub(A.multiplyScalar(A.dot(S))).normalize(),b.crossVectors(w,S);let R=b.dot(l[_])<0?-1:1;a.setXYZW(_,M.x,M.y,M.z,R)}for(let _=0,S=x.length;_<S;++_){let U=x[_],R=U.start,F=U.count;for(let O=R,G=R+F;O<G;O+=3)C(e.getX(O+0)),C(e.getX(O+1)),C(e.getX(O+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new He(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,m=n.count;u<m;u++)n.setXYZ(u,0,0,0);let s=new D,r=new D,a=new D,o=new D,l=new D,c=new D,h=new D,p=new D;if(e)for(let u=0,m=e.count;u<m;u+=3){let v=e.getX(u+0),g=e.getX(u+1),f=e.getX(u+2);s.fromBufferAttribute(t,v),r.fromBufferAttribute(t,g),a.fromBufferAttribute(t,f),h.subVectors(a,r),p.subVectors(s,r),h.cross(p),o.fromBufferAttribute(n,v),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,f),o.add(h),l.add(h),c.add(h),n.setXYZ(v,o.x,o.y,o.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let u=0,m=t.count;u<m;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),p.subVectors(s,r),h.cross(p),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Nt.fromBufferAttribute(e,t),Nt.normalize(),e.setXYZ(t,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,p=o.normalized,u=new c.constructor(l.length*h),m=0,v=0;for(let g=0,f=l.length;g<f;g++){o.isInterleavedBufferAttribute?m=l[g]*o.data.stride+o.offset:m=l[g]*h;for(let d=0;d<h;d++)u[v++]=c[m++]}return new He(u,h,p)}if(this.index===null)return ke("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,p=c.length;h<p;h++){let u=c[h],m=e(u,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let p=0,u=c.length;p<u;p++){let m=c[p];h.push(m.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],p=r[c];for(let u=0,m=p.length;u<m;u++)h.push(p[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let p=a[c];this.addGroup(p.start,p.count,p.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Vf=0,ci=class extends Yn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=er(),this.name="",this.type="Material",this.blending=Ai,this.side=Xn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Gr,this.blendDst=Vr,this.blendEquation=Tn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ot(0,0,0),this.blendAlpha=0,this.depthFunc=Ei,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ml,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wi,this.stencilZFail=wi,this.stencilZPass=wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){ke(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){ke(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ai&&(n.blending=this.blending),this.side!==Xn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Gr&&(n.blendSrc=this.blendSrc),this.blendDst!==Vr&&(n.blendDst=this.blendDst),this.blendEquation!==Tn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ei&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ml&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==wi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==wi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Vn=new D,al=new D,Tr=new D,ri=new D,ol=new D,Ar=new D,ll=new D,Os=class{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Vn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Vn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Vn.copy(this.origin).addScaledVector(this.direction,t),Vn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){al.copy(e).add(t).multiplyScalar(.5),Tr.copy(t).sub(e).normalize(),ri.copy(this.origin).sub(al);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Tr),o=ri.dot(this.direction),l=-ri.dot(Tr),c=ri.lengthSq(),h=Math.abs(1-a*a),p,u,m,v;if(h>0)if(p=a*l-o,u=a*o-l,v=r*h,p>=0)if(u>=-v)if(u<=v){let g=1/h;p*=g,u*=g,m=p*(p+a*u+2*o)+u*(a*p+u+2*l)+c}else u=r,p=Math.max(0,-(a*u+o)),m=-p*p+u*(u+2*l)+c;else u=-r,p=Math.max(0,-(a*u+o)),m=-p*p+u*(u+2*l)+c;else u<=-v?(p=Math.max(0,-(-a*r+o)),u=p>0?-r:Math.min(Math.max(-r,-l),r),m=-p*p+u*(u+2*l)+c):u<=v?(p=0,u=Math.min(Math.max(-r,-l),r),m=u*(u+2*l)+c):(p=Math.max(0,-(a*r+o)),u=p>0?r:Math.min(Math.max(-r,-l),r),m=-p*p+u*(u+2*l)+c);else u=a>0?-r:r,p=Math.max(0,-(a*u+o)),m=-p*p+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,p),s&&s.copy(al).addScaledVector(Tr,u),m}intersectSphere(e,t){Vn.subVectors(e.center,this.origin);let n=Vn.dot(this.direction),s=Vn.dot(Vn)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,p=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),p>=0?(o=(e.min.z-u.z)*p,l=(e.max.z-u.z)*p):(o=(e.max.z-u.z)*p,l=(e.min.z-u.z)*p),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Vn)!==null}intersectTriangle(e,t,n,s,r){ol.subVectors(t,e),Ar.subVectors(n,e),ll.crossVectors(ol,Ar);let a=this.direction.dot(ll),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ri.subVectors(this.origin,e);let l=o*this.direction.dot(Ar.crossVectors(ri,Ar));if(l<0)return null;let c=o*this.direction.dot(ol.cross(ri));if(c<0||l+c>a)return null;let h=-o*ri.dot(ll);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Bs=class extends ci{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=bl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Zc=new ht,bi=new Os,Er=new St,Kc=new D,Cr=new D,Rr=new D,Pr=new D,cl=new D,Ir=new D,$c=new D,Dr=new D,We=class extends on{constructor(e=new lt,t=new Bs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Ir.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],p=r[l];h!==0&&(cl.fromBufferAttribute(p,e),a?Ir.addScaledVector(cl,h):Ir.addScaledVector(cl.sub(t),h))}t.add(Ir)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Er.copy(n.boundingSphere),Er.applyMatrix4(r),bi.copy(e.ray).recast(e.near),!(Er.containsPoint(bi.origin)===!1&&(bi.intersectSphere(Er,Kc)===null||bi.origin.distanceToSquared(Kc)>(e.far-e.near)**2))&&(Zc.copy(r).invert(),bi.copy(e.ray).applyMatrix4(Zc),!(n.boundingBox!==null&&bi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,bi)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,p=r.attributes.normal,u=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,g=u.length;v<g;v++){let f=u[v],d=a[f.materialIndex],x=Math.max(f.start,m.start),M=Math.min(o.count,Math.min(f.start+f.count,m.start+m.count));for(let b=x,A=M;b<A;b+=3){let w=o.getX(b),C=o.getX(b+1),_=o.getX(b+2);s=Lr(this,d,e,n,c,h,p,w,C,_),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let v=Math.max(0,m.start),g=Math.min(o.count,m.start+m.count);for(let f=v,d=g;f<d;f+=3){let x=o.getX(f),M=o.getX(f+1),b=o.getX(f+2);s=Lr(this,a,e,n,c,h,p,x,M,b),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,g=u.length;v<g;v++){let f=u[v],d=a[f.materialIndex],x=Math.max(f.start,m.start),M=Math.min(l.count,Math.min(f.start+f.count,m.start+m.count));for(let b=x,A=M;b<A;b+=3){let w=b,C=b+1,_=b+2;s=Lr(this,d,e,n,c,h,p,w,C,_),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let v=Math.max(0,m.start),g=Math.min(l.count,m.start+m.count);for(let f=v,d=g;f<d;f+=3){let x=f,M=f+1,b=f+2;s=Lr(this,a,e,n,c,h,p,x,M,b),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}};function Hf(i,e,t,n,s,r,a,o){let l;if(e.side===Jt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Xn,o),l===null)return null;Dr.copy(o),Dr.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Dr);return c<t.near||c>t.far?null:{distance:c,point:Dr.clone(),object:i}}function Lr(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Cr),i.getVertexPosition(l,Rr),i.getVertexPosition(c,Pr);let h=Hf(i,e,t,n,Cr,Rr,Pr,$c);if(h){let p=new D;oi.getBarycoord($c,Cr,Rr,Pr,p),s&&(h.uv=oi.getInterpolatedAttribute(s,o,l,c,p,new Xe)),r&&(h.uv1=oi.getInterpolatedAttribute(r,o,l,c,p,new Xe)),a&&(h.normal=oi.getInterpolatedAttribute(a,o,l,c,p,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new D,materialIndex:0};oi.getNormal(Cr,Rr,Pr,u.normal),h.face=u,h.barycoord=p}return h}var Rn=class extends Qt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=xt,h=xt,p,u){super(null,a,o,l,c,h,s,r,p,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Rt=class extends He{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}};var hl=new D,Wf=new D,Xf=new Ye,wn=class{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=hl.subVectors(n,t).cross(Wf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(hl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Xf.getNormalMatrix(e),s=this.coplanarPoint(hl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Si=new St,qf=new Xe(.5,.5),Fr=new D,zs=class{constructor(e=new wn,t=new wn,n=new wn,s=new wn,r=new wn,a=new wn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=_n,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],p=r[5],u=r[6],m=r[7],v=r[8],g=r[9],f=r[10],d=r[11],x=r[12],M=r[13],b=r[14],A=r[15];if(s[0].setComponents(c-a,m-h,d-v,A-x).normalize(),s[1].setComponents(c+a,m+h,d+v,A+x).normalize(),s[2].setComponents(c+o,m+p,d+g,A+M).normalize(),s[3].setComponents(c-o,m-p,d-g,A-M).normalize(),n)s[4].setComponents(l,u,f,b).normalize(),s[5].setComponents(c-l,m-u,d-f,A-b).normalize();else if(s[4].setComponents(c-l,m-u,d-f,A-b).normalize(),t===_n)s[5].setComponents(c+l,m+u,d+f,A+b).normalize();else if(t===Ps)s[5].setComponents(l,u,f,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Si.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Si.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Si)}intersectsSprite(e){Si.center.set(0,0,0);let t=qf.distanceTo(e.center);return Si.radius=.7071067811865476+t,Si.applyMatrix4(e.matrixWorld),this.intersectsSphere(Si)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Fr.x=s.normal.x>0?e.max.x:e.min.x,Fr.y=s.normal.y>0?e.max.y:e.min.y,Fr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Fr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var na=class extends ci{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ot(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Jc=new ht,vl=new Os,Nr=new St,Ur=new D,Ci=class extends on{constructor(e=new lt,t=new na){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Nr.copy(n.boundingSphere),Nr.applyMatrix4(s),Nr.radius+=r,e.ray.intersectsSphere(Nr)===!1)return;Jc.copy(s).invert(),vl.copy(e.ray).applyMatrix4(Jc);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,p=n.attributes.position;if(c!==null){let u=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let v=u,g=m;v<g;v++){let f=c.getX(v);Ur.fromBufferAttribute(p,f),jc(Ur,f,l,s,e,t,this)}}else{let u=Math.max(0,a.start),m=Math.min(p.count,a.start+a.count);for(let v=u,g=m;v<g;v++)Ur.fromBufferAttribute(p,v),jc(Ur,v,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function jc(i,e,t,n,s,r,a){let o=vl.distanceSqToPoint(i);if(o<t){let l=new D;vl.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var ks=class extends Qt{constructor(e=[],t=di,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}};var Pn=class extends Qt{constructor(e,t,n=yn,s,r,a,o=xt,l=xt,c,h=An,p=1){if(h!==An&&h!==pi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:p};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new cs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ia=class extends Pn{constructor(e,t=yn,n=di,s,r,a=xt,o=xt,l,c=An){let h={width:e,height:e,depth:1},p=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Gs=class extends Qt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},$t=class i extends lt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],p=[],u=0,m=0;v("z","y","x",-1,-1,n,t,e,a,r,0),v("z","y","x",1,-1,n,t,-e,a,r,1),v("x","z","y",1,1,e,n,t,s,a,2),v("x","z","y",1,-1,e,n,-t,s,a,3),v("x","y","z",1,-1,e,t,n,s,r,4),v("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Ct(c,3)),this.setAttribute("normal",new Ct(h,3)),this.setAttribute("uv",new Ct(p,2));function v(g,f,d,x,M,b,A,w,C,_,S){let U=b/C,R=A/_,F=b/2,O=A/2,G=w/2,H=C+1,V=_+1,W=0,re=0,se=new D;for(let ge=0;ge<V;ge++){let ye=ge*R-O;for(let me=0;me<H;me++){let Be=me*U-F;se[g]=Be*x,se[f]=ye*M,se[d]=G,c.push(se.x,se.y,se.z),se[g]=0,se[f]=0,se[d]=w>0?1:-1,h.push(se.x,se.y,se.z),p.push(me/C),p.push(1-ge/_),W+=1}}for(let ge=0;ge<_;ge++)for(let ye=0;ye<C;ye++){let me=u+ye+H*ge,Be=u+ye+H*(ge+1),st=u+(ye+1)+H*(ge+1),rt=u+(ye+1)+H*ge;l.push(me,Be,rt),l.push(Be,st,rt),re+=6}o.addGroup(m,re,S),m+=re,u+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Vs=class i extends lt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],p=[],u=[],m=[],v=0,g=[],f=n/2,d=0;x(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new Ct(p,3)),this.setAttribute("normal",new Ct(u,3)),this.setAttribute("uv",new Ct(m,2));function x(){let b=new D,A=new D,w=0,C=(t-e)/n;for(let _=0;_<=r;_++){let S=[],U=_/r,R=U*(t-e)+e;for(let F=0;F<=s;F++){let O=F/s,G=O*l+o,H=Math.sin(G),V=Math.cos(G);A.x=R*H,A.y=-U*n+f,A.z=R*V,p.push(A.x,A.y,A.z),b.set(H,C,V).normalize(),u.push(b.x,b.y,b.z),m.push(O,1-U),S.push(v++)}g.push(S)}for(let _=0;_<s;_++)for(let S=0;S<r;S++){let U=g[S][_],R=g[S+1][_],F=g[S+1][_+1],O=g[S][_+1];(e>0||S!==0)&&(h.push(U,R,O),w+=3),(t>0||S!==r-1)&&(h.push(R,F,O),w+=3)}c.addGroup(d,w,0),d+=w}function M(b){let A=v,w=new Xe,C=new D,_=0,S=b===!0?e:t,U=b===!0?1:-1;for(let F=1;F<=s;F++)p.push(0,f*U,0),u.push(0,U,0),m.push(.5,.5),v++;let R=v;for(let F=0;F<=s;F++){let G=F/s*l+o,H=Math.cos(G),V=Math.sin(G);C.x=S*V,C.y=f*U,C.z=S*H,p.push(C.x,C.y,C.z),u.push(0,U,0),w.x=H*.5+.5,w.y=V*.5*U+.5,m.push(w.x,w.y),v++}for(let F=0;F<s;F++){let O=A+F,G=R+F;b===!0?h.push(G,G+1,O):h.push(G+1,G,O),_+=3}c.addGroup(d,_,b===!0?1:2),d+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var sa=class i extends lt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),h(),this.setAttribute("position",new Ct(r,3)),this.setAttribute("normal",new Ct(r.slice(),3)),this.setAttribute("uv",new Ct(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){let M=new D,b=new D,A=new D;for(let w=0;w<t.length;w+=3)m(t[w+0],M),m(t[w+1],b),m(t[w+2],A),l(M,b,A,x)}function l(x,M,b,A){let w=A+1,C=[];for(let _=0;_<=w;_++){C[_]=[];let S=x.clone().lerp(b,_/w),U=M.clone().lerp(b,_/w),R=w-_;for(let F=0;F<=R;F++)F===0&&_===w?C[_][F]=S:C[_][F]=S.clone().lerp(U,F/R)}for(let _=0;_<w;_++)for(let S=0;S<2*(w-_)-1;S++){let U=Math.floor(S/2);S%2===0?(u(C[_][U+1]),u(C[_+1][U]),u(C[_][U])):(u(C[_][U+1]),u(C[_+1][U+1]),u(C[_+1][U]))}}function c(x){let M=new D;for(let b=0;b<r.length;b+=3)M.x=r[b+0],M.y=r[b+1],M.z=r[b+2],M.normalize().multiplyScalar(x),r[b+0]=M.x,r[b+1]=M.y,r[b+2]=M.z}function h(){let x=new D;for(let M=0;M<r.length;M+=3){x.x=r[M+0],x.y=r[M+1],x.z=r[M+2];let b=f(x)/2/Math.PI+.5,A=d(x)/Math.PI+.5;a.push(b,1-A)}v(),p()}function p(){for(let x=0;x<a.length;x+=6){let M=a[x+0],b=a[x+2],A=a[x+4],w=Math.max(M,b,A),C=Math.min(M,b,A);w>.9&&C<.1&&(M<.2&&(a[x+0]+=1),b<.2&&(a[x+2]+=1),A<.2&&(a[x+4]+=1))}}function u(x){r.push(x.x,x.y,x.z)}function m(x,M){let b=x*3;M.x=e[b+0],M.y=e[b+1],M.z=e[b+2]}function v(){let x=new D,M=new D,b=new D,A=new D,w=new Xe,C=new Xe,_=new Xe;for(let S=0,U=0;S<r.length;S+=9,U+=6){x.set(r[S+0],r[S+1],r[S+2]),M.set(r[S+3],r[S+4],r[S+5]),b.set(r[S+6],r[S+7],r[S+8]),w.set(a[U+0],a[U+1]),C.set(a[U+2],a[U+3]),_.set(a[U+4],a[U+5]),A.copy(x).add(M).add(b).divideScalar(3);let R=f(A);g(w,U+0,x,R),g(C,U+2,M,R),g(_,U+4,b,R)}}function g(x,M,b,A){A<0&&x.x===1&&(a[M]=x.x-1),b.x===0&&b.z===0&&(a[M]=A/2/Math.PI+.5)}function f(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.detail)}};var Hs=class i extends sa{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Ri=class i extends lt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,p=e/o,u=t/l,m=[],v=[],g=[],f=[];for(let d=0;d<h;d++){let x=d*u-a;for(let M=0;M<c;M++){let b=M*p-r;v.push(b,-x,0),g.push(0,0,1),f.push(M/o),f.push(1-d/l)}}for(let d=0;d<l;d++)for(let x=0;x<o;x++){let M=x+c*d,b=x+c*(d+1),A=x+1+c*(d+1),w=x+1+c*d;m.push(M,b,w),m.push(b,A,w)}this.setIndex(m),this.setAttribute("position",new Ct(v,3)),this.setAttribute("normal",new Ct(g,3)),this.setAttribute("uv",new Ct(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};function Di(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(ke("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Kt(i){let e={};for(let t=0;t<i.length;t++){let n=Di(i[t]);for(let s in n)e[s]=n[s]}return e}function Yf(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function zl(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}var Oh={clone:Di,merge:Kt},Zf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ge=class extends ci{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Zf,this.fragmentShader=Kf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Di(e.uniforms),this.uniformsGroups=Yf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ra=class extends Ge{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var aa=class extends ci{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},oa=class extends ci{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Or(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}var hi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},la=class extends hi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:fl,endingEnd:fl}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case dl:r=e,o=2*t-n;break;case pl:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case dl:a=e,l=2*n-t;break;case pl:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,p=this._offsetNext,u=this._weightPrev,m=this._weightNext,v=(n-t)/(s-t),g=v*v,f=g*v,d=-u*f+2*u*g-u*v,x=(1+u)*f+(-1.5-2*u)*g+(-.5+u)*v+1,M=(-1-m)*f+(1.5+m)*g+.5*v,b=m*f-m*g;for(let A=0;A!==o;++A)r[A]=d*a[h+A]+x*a[c+A]+M*a[l+A]+b*a[p+A];return r}},ca=class extends hi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),p=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*p+a[l+u]*h;return r}},ha=class extends hi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ua=class extends hi{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.settings||this.DefaultSettings_,p=h.inTangents,u=h.outTangents;if(!p||!u){let g=(n-t)/(s-t),f=1-g;for(let d=0;d!==o;++d)r[d]=a[c+d]*f+a[l+d]*g;return r}let m=o*2,v=e-1;for(let g=0;g!==o;++g){let f=a[c+g],d=a[l+g],x=v*m+g*2,M=u[x],b=u[x+1],A=e*m+g*2,w=p[A],C=p[A+1],_=(n-t)/(s-t),S,U,R,F,O;for(let G=0;G<8;G++){S=_*_,U=S*_,R=1-_,F=R*R,O=F*R;let V=O*t+3*F*_*M+3*R*S*w+U*s-n;if(Math.abs(V)<1e-10)break;let W=3*F*(M-t)+6*R*_*(w-M)+3*S*(s-w);if(Math.abs(W)<1e-10)break;_=_-V/W,_=Math.max(0,Math.min(1,_))}r[g]=O*f+3*F*_*b+3*R*S*C+U*d}return r}},ln=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Or(t,this.TimeBufferType),this.values=Or(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Or(e.times,Array),values:Or(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ha(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ca(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new la(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ua(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case Cs:t=this.InterpolantFactoryMethodDiscrete;break;case Jr:t=this.InterpolantFactoryMethodLinear;break;case kr:t=this.InterpolantFactoryMethodSmooth;break;case ul:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return ke("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Cs;case this.InterpolantFactoryMethodLinear:return Jr;case this.InterpolantFactoryMethodSmooth:return kr;case this.InterpolantFactoryMethodBezier:return ul}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(ze("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(ze("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){ze("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){ze("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&wf(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){ze("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===kr,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let p=o*n,u=p-n,m=p+n;for(let v=0;v!==n;++v){let g=t[p+v];if(g!==t[u+v]||g!==t[m+v]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let p=o*n,u=a*n;for(let m=0;m!==n;++m)t[u+m]=t[p+m]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};ln.prototype.ValueTypeName="";ln.prototype.TimeBufferType=Float32Array;ln.prototype.ValueBufferType=Float32Array;ln.prototype.DefaultInterpolation=Jr;var ui=class extends ln{constructor(e,t,n){super(e,t,n)}};ui.prototype.ValueTypeName="bool";ui.prototype.ValueBufferType=Array;ui.prototype.DefaultInterpolation=Cs;ui.prototype.InterpolantFactoryMethodLinear=void 0;ui.prototype.InterpolantFactoryMethodSmooth=void 0;var fa=class extends ln{constructor(e,t,n,s){super(e,t,n,s)}};fa.prototype.ValueTypeName="color";var da=class extends ln{constructor(e,t,n,s){super(e,t,n,s)}};da.prototype.ValueTypeName="number";var pa=class extends hi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)En.slerpFlat(r,0,a,c-o,a,c,l);return r}},Ws=class extends ln{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new pa(this.times,this.values,this.getValueSize(),e)}};Ws.prototype.ValueTypeName="quaternion";Ws.prototype.InterpolantFactoryMethodSmooth=void 0;var fi=class extends ln{constructor(e,t,n){super(e,t,n)}};fi.prototype.ValueTypeName="string";fi.prototype.ValueBufferType=Array;fi.prototype.DefaultInterpolation=Cs;fi.prototype.InterpolantFactoryMethodLinear=void 0;fi.prototype.InterpolantFactoryMethodSmooth=void 0;var ma=class extends ln{constructor(e,t,n,s){super(e,t,n,s)}};ma.prototype.ValueTypeName="vector";var ga=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,p){return c.push(h,p),this},this.removeHandler=function(h){let p=c.indexOf(h);return p!==-1&&c.splice(p,2),this},this.getHandler=function(h){for(let p=0,u=c.length;p<u;p+=2){let m=c[p],v=c[p+1];if(m.global&&(m.lastIndex=0),m.test(h))return v}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Bh=new ga,va=class{constructor(e){this.manager=e!==void 0?e:Bh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};va.DEFAULT_MATERIAL_NAME="__DEFAULT";var Br=new D,zr=new En,Sn=new D,Xs=class extends on{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=_n,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Br,zr,Sn),Sn.x===1&&Sn.y===1&&Sn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Br,zr,Sn.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Br,zr,Sn),Sn.x===1&&Sn.y===1&&Sn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Br,zr,Sn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ai=new D,Qc=new Xe,eh=new Xe,qt=class extends Xs{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=jr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Vo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return jr*2*Math.atan(Math.tan(Vo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ai.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ai.x,ai.y).multiplyScalar(-e/ai.z),ai.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ai.x,ai.y).multiplyScalar(-e/ai.z)}getViewSize(e,t){return this.getViewBounds(e,Qc,eh),t.subVectors(eh,Qc)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Vo*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var cn=class extends Xs{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};var en=class extends lt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var ss=-90,rs=1,xa=class extends on{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new qt(ss,rs,e,t);s.layers=this.layers,this.add(s);let r=new qt(ss,rs,e,t);r.layers=this.layers,this.add(r);let a=new qt(ss,rs,e,t);a.layers=this.layers,this.add(a);let o=new qt(ss,rs,e,t);o.layers=this.layers,this.add(o);let l=new qt(ss,rs,e,t);l.layers=this.layers,this.add(l);let c=new qt(ss,rs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===_n)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ps)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,p=e.getRenderTarget(),u=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;let g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let f=!1;e.isWebGLRenderer===!0?f=e.state.buffers.depth.getReversed():f=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(p,u,m),e.xr.enabled=v,n.texture.needsPMREMUpdate=!0}},_a=class extends qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var kl="\\[\\]\\.:\\/",$f=new RegExp("["+kl+"]","g"),Gl="[^"+kl+"]",Jf="[^"+kl.replace("\\.","")+"]",jf=/((?:WC+[\/:])*)/.source.replace("WC",Gl),Qf=/(WCOD+)?/.source.replace("WCOD",Jf),ed=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Gl),td=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Gl),nd=new RegExp("^"+jf+Qf+ed+td+"$"),id=["material","materials","bones","map"],xl=class{constructor(e,t,n){let s=n||_t.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},_t=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace($f,"")}static parseTrackName(e){let t=nd.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);id.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){ke("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ze("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ze("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ze("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){ze("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){ze("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;ze("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};_t.Composite=xl;_t.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};_t.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};_t.prototype.GetterByBindingType=[_t.prototype._getValue_direct,_t.prototype._getValue_array,_t.prototype._getValue_arrayElement,_t.prototype._getValue_toArray];_t.prototype.SetterByBindingTypeAndVersioning=[[_t.prototype._setValue_direct,_t.prototype._setValue_direct_setNeedsUpdate,_t.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_array,_t.prototype._setValue_array_setNeedsUpdate,_t.prototype._setValue_array_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_arrayElement,_t.prototype._setValue_arrayElement_setNeedsUpdate,_t.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_fromArray,_t.prototype._setValue_fromArray_setNeedsUpdate,_t.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Hv=new Float32Array(1);function Vl(i,e,t,n){let s=sd(n);switch(t){case Nl:return i*e;case Ii:return i*e/s.components*s.byteLength;case Ea:return i*e/s.components*s.byteLength;case Kn:return i*e*2/s.components*s.byteLength;case Ca:return i*e*2/s.components*s.byteLength;case Ul:return i*e*3/s.components*s.byteLength;case Mt:return i*e*4/s.components*s.byteLength;case Ra:return i*e*4/s.components*s.byteLength;case $s:case Js:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case js:case Qs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ia:case La:return Math.max(i,16)*Math.max(e,8)/4;case Pa:case Da:return Math.max(i,8)*Math.max(e,8)/2;case Fa:case Na:case Oa:case Ba:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ua:case za:case ka:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ga:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Va:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ha:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Wa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Xa:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case qa:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ya:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Za:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ka:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case $a:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ja:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ja:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Qa:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case eo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case to:case no:case io:return Math.ceil(i/4)*Math.ceil(e/4)*16;case so:case ro:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ao:case oo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function sd(i){switch(i){case Ut:case Il:return{byteLength:1,components:1};case ds:case Dl:case Pt:return{byteLength:2,components:1};case Ta:case Aa:return{byteLength:2,components:4};case yn:case wa:case Vt:return{byteLength:4,components:1};case Ll:case Fl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"183"}}));typeof window<"u"&&(window.__THREE__?ke("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="183");function ou(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function ad(i){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,p=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:p}}function n(o,l,c){let h=l.array,p=l.updateRanges;if(i.bindBuffer(c,o),p.length===0)i.bufferSubData(c,0,h);else{p.sort((m,v)=>m.start-v.start);let u=0;for(let m=1;m<p.length;m++){let v=p[u],g=p[m];g.start<=v.start+v.count+1?v.count=Math.max(v.count,g.start+g.count-v.start):(++u,p[u]=g)}p.length=u+1;for(let m=0,v=p.length;m<v;m++){let g=p[m];i.bufferSubData(c,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var od=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ld=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,cd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ud=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,fd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,dd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,pd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,md=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,gd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,vd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_d=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,yd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Md=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,bd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Sd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Td=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ad=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Ed=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Cd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Rd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Pd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Id=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Dd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Ld=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Fd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Nd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ud=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Od="gl_FragColor = linearToOutputTexel( gl_FragColor );",Bd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,kd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Gd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Vd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Hd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Wd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Yd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Kd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$d=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,jd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Qd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,ep=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,np=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ip=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,rp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ap=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,op=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,up=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,dp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,gp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_p=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,yp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Sp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Tp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ap=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ep=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Rp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Pp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ip=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Dp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Lp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Fp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Np=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Up=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Op=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Bp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Gp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Vp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Hp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Wp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Xp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,qp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Yp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Zp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Kp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,$p=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,e0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,t0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,n0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,i0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,s0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,r0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,a0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,o0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,l0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,c0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,h0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,u0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,f0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,d0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,p0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,m0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,g0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,v0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,x0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,y0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,M0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,b0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,S0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,w0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,T0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,A0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,E0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,C0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,R0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,I0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,D0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,L0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,F0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,N0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,U0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,O0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,B0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,z0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ke={alphahash_fragment:od,alphahash_pars_fragment:ld,alphamap_fragment:cd,alphamap_pars_fragment:hd,alphatest_fragment:ud,alphatest_pars_fragment:fd,aomap_fragment:dd,aomap_pars_fragment:pd,batching_pars_vertex:md,batching_vertex:gd,begin_vertex:vd,beginnormal_vertex:xd,bsdfs:_d,iridescence_fragment:yd,bumpmap_pars_fragment:Md,clipping_planes_fragment:bd,clipping_planes_pars_fragment:Sd,clipping_planes_pars_vertex:wd,clipping_planes_vertex:Td,color_fragment:Ad,color_pars_fragment:Ed,color_pars_vertex:Cd,color_vertex:Rd,common:Pd,cube_uv_reflection_fragment:Id,defaultnormal_vertex:Dd,displacementmap_pars_vertex:Ld,displacementmap_vertex:Fd,emissivemap_fragment:Nd,emissivemap_pars_fragment:Ud,colorspace_fragment:Od,colorspace_pars_fragment:Bd,envmap_fragment:zd,envmap_common_pars_fragment:kd,envmap_pars_fragment:Gd,envmap_pars_vertex:Vd,envmap_physical_pars_fragment:Qd,envmap_vertex:Hd,fog_vertex:Wd,fog_pars_vertex:Xd,fog_fragment:qd,fog_pars_fragment:Yd,gradientmap_pars_fragment:Zd,lightmap_pars_fragment:Kd,lights_lambert_fragment:$d,lights_lambert_pars_fragment:Jd,lights_pars_begin:jd,lights_toon_fragment:ep,lights_toon_pars_fragment:tp,lights_phong_fragment:np,lights_phong_pars_fragment:ip,lights_physical_fragment:sp,lights_physical_pars_fragment:rp,lights_fragment_begin:ap,lights_fragment_maps:op,lights_fragment_end:lp,logdepthbuf_fragment:cp,logdepthbuf_pars_fragment:hp,logdepthbuf_pars_vertex:up,logdepthbuf_vertex:fp,map_fragment:dp,map_pars_fragment:pp,map_particle_fragment:mp,map_particle_pars_fragment:gp,metalnessmap_fragment:vp,metalnessmap_pars_fragment:xp,morphinstance_vertex:_p,morphcolor_vertex:yp,morphnormal_vertex:Mp,morphtarget_pars_vertex:bp,morphtarget_vertex:Sp,normal_fragment_begin:wp,normal_fragment_maps:Tp,normal_pars_fragment:Ap,normal_pars_vertex:Ep,normal_vertex:Cp,normalmap_pars_fragment:Rp,clearcoat_normal_fragment_begin:Pp,clearcoat_normal_fragment_maps:Ip,clearcoat_pars_fragment:Dp,iridescence_pars_fragment:Lp,opaque_fragment:Fp,packing:Np,premultiplied_alpha_fragment:Up,project_vertex:Op,dithering_fragment:Bp,dithering_pars_fragment:zp,roughnessmap_fragment:kp,roughnessmap_pars_fragment:Gp,shadowmap_pars_fragment:Vp,shadowmap_pars_vertex:Hp,shadowmap_vertex:Wp,shadowmask_pars_fragment:Xp,skinbase_vertex:qp,skinning_pars_vertex:Yp,skinning_vertex:Zp,skinnormal_vertex:Kp,specularmap_fragment:$p,specularmap_pars_fragment:Jp,tonemapping_fragment:jp,tonemapping_pars_fragment:Qp,transmission_fragment:e0,transmission_pars_fragment:t0,uv_pars_fragment:n0,uv_pars_vertex:i0,uv_vertex:s0,worldpos_vertex:r0,background_vert:a0,background_frag:o0,backgroundCube_vert:l0,backgroundCube_frag:c0,cube_vert:h0,cube_frag:u0,depth_vert:f0,depth_frag:d0,distance_vert:p0,distance_frag:m0,equirect_vert:g0,equirect_frag:v0,linedashed_vert:x0,linedashed_frag:_0,meshbasic_vert:y0,meshbasic_frag:M0,meshlambert_vert:b0,meshlambert_frag:S0,meshmatcap_vert:w0,meshmatcap_frag:T0,meshnormal_vert:A0,meshnormal_frag:E0,meshphong_vert:C0,meshphong_frag:R0,meshphysical_vert:P0,meshphysical_frag:I0,meshtoon_vert:D0,meshtoon_frag:L0,points_vert:F0,points_frag:N0,shadow_vert:U0,shadow_frag:O0,sprite_vert:B0,sprite_frag:z0},ve={common:{diffuse:{value:new ot(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new Xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ot(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ot(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new ot(16777215)},opacity:{value:1},center:{value:new Xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},Fn={basic:{uniforms:Kt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:Kt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new ot(0)},envMapIntensity:{value:1}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:Kt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new ot(0)},specular:{value:new ot(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:Kt([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new ot(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:Kt([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new ot(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:Kt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:Kt([ve.points,ve.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:Kt([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:Kt([ve.common,ve.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:Kt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:Kt([ve.sprite,ve.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distance:{uniforms:Kt([ve.common,ve.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distance_vert,fragmentShader:Ke.distance_frag},shadow:{uniforms:Kt([ve.lights,ve.fog,{color:{value:new ot(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};Fn.physical={uniforms:Kt([Fn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new Xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new ot(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new Xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new ot(0)},specularColor:{value:new ot(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new Xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};var ho={r:0,b:0,g:0},Li=new Cn,k0=new ht;function G0(i,e,t,n,s,r){let a=new ot(0),o=s===!0?0:1,l,c,h=null,p=0,u=null;function m(x){let M=x.isScene===!0?x.background:null;if(M&&M.isTexture){let b=x.backgroundBlurriness>0;M=e.get(M,b)}return M}function v(x){let M=!1,b=m(x);b===null?f(a,o):b&&b.isColor&&(f(b,1),M=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(x,M){let b=m(M);b&&(b.isCubeTexture||b.mapping===Zs)?(c===void 0&&(c=new We(new $t(1,1,1),new Ge({name:"BackgroundCubeMaterial",uniforms:Di(Fn.backgroundCube.uniforms),vertexShader:Fn.backgroundCube.vertexShader,fragmentShader:Fn.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,w,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),Li.copy(M.backgroundRotation),Li.x*=-1,Li.y*=-1,Li.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Li.y*=-1,Li.z*=-1),c.material.uniforms.envMap.value=b,c.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(k0.makeRotationFromEuler(Li)),c.material.toneMapped=nt.getTransfer(b.colorSpace)!==ct,(h!==b||p!==b.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=b,p=b.version,u=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new We(new Ri(2,2),new Ge({name:"BackgroundMaterial",uniforms:Di(Fn.background.uniforms),vertexShader:Fn.background.vertexShader,fragmentShader:Fn.background.fragmentShader,side:Xn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=nt.getTransfer(b.colorSpace)!==ct,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||p!==b.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=b,p=b.version,u=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function f(x,M){x.getRGB(ho,zl(i)),t.buffers.color.setClear(ho.r,ho.g,ho.b,M,r)}function d(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,M=1){a.set(x),o=M,f(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,f(a,o)},render:v,addToRenderList:g,dispose:d}}function V0(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,a=!1;function o(R,F,O,G,H){let V=!1,W=p(R,G,O,F);r!==W&&(r=W,c(r.object)),V=m(R,G,O,H),V&&v(R,G,O,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(V||a)&&(a=!1,b(R,F,O,G),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return i.createVertexArray()}function c(R){return i.bindVertexArray(R)}function h(R){return i.deleteVertexArray(R)}function p(R,F,O,G){let H=G.wireframe===!0,V=n[F.id];V===void 0&&(V={},n[F.id]=V);let W=R.isInstancedMesh===!0?R.id:0,re=V[W];re===void 0&&(re={},V[W]=re);let se=re[O.id];se===void 0&&(se={},re[O.id]=se);let ge=se[H];return ge===void 0&&(ge=u(l()),se[H]=ge),ge}function u(R){let F=[],O=[],G=[];for(let H=0;H<t;H++)F[H]=0,O[H]=0,G[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:O,attributeDivisors:G,object:R,attributes:{},index:null}}function m(R,F,O,G){let H=r.attributes,V=F.attributes,W=0,re=O.getAttributes();for(let se in re)if(re[se].location>=0){let ye=H[se],me=V[se];if(me===void 0&&(se==="instanceMatrix"&&R.instanceMatrix&&(me=R.instanceMatrix),se==="instanceColor"&&R.instanceColor&&(me=R.instanceColor)),ye===void 0||ye.attribute!==me||me&&ye.data!==me.data)return!0;W++}return r.attributesNum!==W||r.index!==G}function v(R,F,O,G){let H={},V=F.attributes,W=0,re=O.getAttributes();for(let se in re)if(re[se].location>=0){let ye=V[se];ye===void 0&&(se==="instanceMatrix"&&R.instanceMatrix&&(ye=R.instanceMatrix),se==="instanceColor"&&R.instanceColor&&(ye=R.instanceColor));let me={};me.attribute=ye,ye&&ye.data&&(me.data=ye.data),H[se]=me,W++}r.attributes=H,r.attributesNum=W,r.index=G}function g(){let R=r.newAttributes;for(let F=0,O=R.length;F<O;F++)R[F]=0}function f(R){d(R,0)}function d(R,F){let O=r.newAttributes,G=r.enabledAttributes,H=r.attributeDivisors;O[R]=1,G[R]===0&&(i.enableVertexAttribArray(R),G[R]=1),H[R]!==F&&(i.vertexAttribDivisor(R,F),H[R]=F)}function x(){let R=r.newAttributes,F=r.enabledAttributes;for(let O=0,G=F.length;O<G;O++)F[O]!==R[O]&&(i.disableVertexAttribArray(O),F[O]=0)}function M(R,F,O,G,H,V,W){W===!0?i.vertexAttribIPointer(R,F,O,H,V):i.vertexAttribPointer(R,F,O,G,H,V)}function b(R,F,O,G){g();let H=G.attributes,V=O.getAttributes(),W=F.defaultAttributeValues;for(let re in V){let se=V[re];if(se.location>=0){let ge=H[re];if(ge===void 0&&(re==="instanceMatrix"&&R.instanceMatrix&&(ge=R.instanceMatrix),re==="instanceColor"&&R.instanceColor&&(ge=R.instanceColor)),ge!==void 0){let ye=ge.normalized,me=ge.itemSize,Be=e.get(ge);if(Be===void 0)continue;let st=Be.buffer,rt=Be.type,Z=Be.bytesPerElement,ae=rt===i.INT||rt===i.UNSIGNED_INT||ge.gpuType===wa;if(ge.isInterleavedBufferAttribute){let fe=ge.data,k=fe.stride,oe=ge.offset;if(fe.isInstancedInterleavedBuffer){for(let ue=0;ue<se.locationSize;ue++)d(se.location+ue,fe.meshPerAttribute);R.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let ue=0;ue<se.locationSize;ue++)f(se.location+ue);i.bindBuffer(i.ARRAY_BUFFER,st);for(let ue=0;ue<se.locationSize;ue++)M(se.location+ue,me/se.locationSize,rt,ye,k*Z,(oe+me/se.locationSize*ue)*Z,ae)}else{if(ge.isInstancedBufferAttribute){for(let fe=0;fe<se.locationSize;fe++)d(se.location+fe,ge.meshPerAttribute);R.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=ge.meshPerAttribute*ge.count)}else for(let fe=0;fe<se.locationSize;fe++)f(se.location+fe);i.bindBuffer(i.ARRAY_BUFFER,st);for(let fe=0;fe<se.locationSize;fe++)M(se.location+fe,me/se.locationSize,rt,ye,me*Z,me/se.locationSize*fe*Z,ae)}}else if(W!==void 0){let ye=W[re];if(ye!==void 0)switch(ye.length){case 2:i.vertexAttrib2fv(se.location,ye);break;case 3:i.vertexAttrib3fv(se.location,ye);break;case 4:i.vertexAttrib4fv(se.location,ye);break;default:i.vertexAttrib1fv(se.location,ye)}}}}x()}function A(){S();for(let R in n){let F=n[R];for(let O in F){let G=F[O];for(let H in G){let V=G[H];for(let W in V)h(V[W].object),delete V[W];delete G[H]}}delete n[R]}}function w(R){if(n[R.id]===void 0)return;let F=n[R.id];for(let O in F){let G=F[O];for(let H in G){let V=G[H];for(let W in V)h(V[W].object),delete V[W];delete G[H]}}delete n[R.id]}function C(R){for(let F in n){let O=n[F];for(let G in O){let H=O[G];if(H[R.id]===void 0)continue;let V=H[R.id];for(let W in V)h(V[W].object),delete V[W];delete H[R.id]}}}function _(R){for(let F in n){let O=n[F],G=R.isInstancedMesh===!0?R.id:0,H=O[G];if(H!==void 0){for(let V in H){let W=H[V];for(let re in W)h(W[re].object),delete W[re];delete H[V]}delete O[G],Object.keys(O).length===0&&delete n[F]}}}function S(){U(),a=!0,r!==s&&(r=s,c(r.object))}function U(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:S,resetDefaultState:U,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:g,enableAttribute:f,disableUnusedAttributes:x}}function H0(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,p){p!==0&&(i.drawArraysInstanced(n,c,h,p),t.update(h,n,p))}function o(c,h,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,p);let m=0;for(let v=0;v<p;v++)m+=h[v];t.update(m,n,1)}function l(c,h,p,u){if(p===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<c.length;v++)a(c[v],h[v],u[v]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,p);let v=0;for(let g=0;g<p;g++)v+=h[g]*u[g];t.update(v,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function W0(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==Mt&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let _=C===Pt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Ut&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Vt&&!_)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(ke("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let p=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),f=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:p,reversedDepthBuffer:u,maxTextures:m,maxVertexTextures:v,maxTextureSize:g,maxCubemapSize:f,maxAttributes:d,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:b,maxSamples:A,samples:w}}function X0(i){let e=this,t=null,n=0,s=!1,r=!1,a=new wn,o=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,u){let m=p.length!==0||u||n!==0||s;return s=u,n=p.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(p,u){t=h(p,u,0)},this.setState=function(p,u,m){let v=p.clippingPlanes,g=p.clipIntersection,f=p.clipShadows,d=i.get(p);if(!s||v===null||v.length===0||r&&!f)r?h(null):c();else{let x=r?0:n,M=x*4,b=d.clippingState||null;l.value=b,b=h(v,u,M,m);for(let A=0;A!==M;++A)b[A]=t[A];d.clippingState=b,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(p,u,m,v){let g=p!==null?p.length:0,f=null;if(g!==0){if(f=l.value,v!==!0||f===null){let d=m+g*4,x=u.matrixWorldInverse;o.getNormalMatrix(x),(f===null||f.length<d)&&(f=new Float32Array(d));for(let M=0,b=m;M!==g;++M,b+=4)a.copy(p[M]).applyMatrix4(x,o),a.normal.toArray(f,b),f[b+3]=a.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,f}}var mi=4,zh=[.125,.215,.35,.446,.526,.582],Ni=20,q0=256,tr=new cn,kh=new ot,Hl=null,Wl=0,Xl=0,ql=!1,Y0=new D,fo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=Y0}=r;Hl=this._renderer.getRenderTarget(),Wl=this._renderer.getActiveCubeFace(),Xl=this._renderer.getActiveMipmapLevel(),ql=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Hl,Wl,Xl),this._renderer.xr.enabled=ql,e.scissorTest=!1,ms(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===di||e.mapping===Pi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Hl=this._renderer.getRenderTarget(),Wl=this._renderer.getActiveCubeFace(),Xl=this._renderer.getActiveMipmapLevel(),ql=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:et,minFilter:et,generateMipmaps:!1,type:Pt,format:Mt,colorSpace:qn,depthBuffer:!1},s=Gh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gh(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Z0(r)),this._blurMaterial=$0(r,e,t),this._ggxMaterial=K0(r,e,t)}return s}_compileMaterial(e){let t=new We(new lt,e);this._renderer.compile(t,tr)}_sceneToCubeUV(e,t,n,s,r){let l=new qt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],p=this._renderer,u=p.autoClear,m=p.toneMapping;p.getClearColor(kh),p.toneMapping=un,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(s),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new We(new $t,new Bs({name:"PMREM.Background",side:Jt,depthWrite:!1,depthTest:!1})));let g=this._backgroundBox,f=g.material,d=!1,x=e.background;x?x.isColor&&(f.color.copy(x),e.background=null,d=!0):(f.color.copy(kh),d=!0);for(let M=0;M<6;M++){let b=M%3;b===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[M],r.y,r.z)):b===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[M]));let A=this._cubeSize;ms(s,b*A,M>2?A:0,A,A),p.setRenderTarget(s),d&&p.render(g,l),p.render(e,l)}p.toneMapping=m,p.autoClear=u,e.background=x}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===di||e.mapping===Pi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vh());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;ms(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,tr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),p=Math.sqrt(c*c-h*h),u=0+c*1.25,m=p*u,{_lodMax:v}=this,g=this._sizeLods[n],f=3*g*(n>v-mi?n-v+mi:0),d=4*(this._cubeSize-g);l.envMap.value=e.texture,l.roughness.value=m,l.mipInt.value=v-t,ms(r,f,d,3*g,2*g),s.setRenderTarget(r),s.render(o,tr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=v-n,ms(e,f,d,3*g,2*g),s.setRenderTarget(e),s.render(o,tr)}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&ze("blur direction must be either latitudinal or longitudinal!");let h=3,p=this._lodMeshes[s];p.material=c;let u=c.uniforms,m=this._sizeLods[n]-1,v=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Ni-1),g=r/v,f=isFinite(r)?1+Math.floor(h*g):Ni;f>Ni&&ke(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${Ni}`);let d=[],x=0;for(let C=0;C<Ni;++C){let _=C/g,S=Math.exp(-_*_/2);d.push(S),C===0?x+=S:C<f&&(x+=2*S)}for(let C=0;C<d.length;C++)d[C]=d[C]/x;u.envMap.value=e.texture,u.samples.value=f,u.weights.value=d,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:M}=this;u.dTheta.value=v,u.mipInt.value=M-n;let b=this._sizeLods[s],A=3*b*(s>M-mi?s-M+mi:0),w=4*(this._cubeSize-b);ms(t,A,w,3*b,2*b),l.setRenderTarget(t),l.render(p,tr)}};function Z0(i){let e=[],t=[],n=[],s=i,r=i-mi+1+zh.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let l=1/o;a>i-mi?l=zh[a-i+mi-1]:a===0&&(l=0),t.push(l);let c=1/(o-2),h=-c,p=1+c,u=[h,h,p,h,p,p,h,h,p,p,h,p],m=6,v=6,g=3,f=2,d=1,x=new Float32Array(g*v*m),M=new Float32Array(f*v*m),b=new Float32Array(d*v*m);for(let w=0;w<m;w++){let C=w%3*2/3-1,_=w>2?0:-1,S=[C,_,0,C+2/3,_,0,C+2/3,_+1,0,C,_,0,C+2/3,_+1,0,C,_+1,0];x.set(S,g*v*w),M.set(u,f*v*w);let U=[w,w,w,w,w,w];b.set(U,d*v*w)}let A=new lt;A.setAttribute("position",new He(x,g)),A.setAttribute("uv",new He(M,f)),A.setAttribute("faceIndex",new He(b,d)),n.push(new We(A,null)),s>mi&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Gh(i,e,t){let n=new yt(i,e,t);return n.texture.mapping=Zs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ms(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function K0(i,e,t){return new Ge({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:q0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:go(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:hn,depthTest:!1,depthWrite:!1})}function $0(i,e,t){let n=new Float32Array(Ni),s=new D(0,1,0);return new Ge({name:"SphericalGaussianBlur",defines:{n:Ni,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:hn,depthTest:!1,depthWrite:!1})}function Vh(){return new Ge({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:hn,depthTest:!1,depthWrite:!1})}function Hh(){return new Ge({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:hn,depthTest:!1,depthWrite:!1})}function go(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var po=class extends yt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ks(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new $t(5,5,5),r=new Ge({name:"CubemapFromEquirect",uniforms:Di(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Jt,blending:hn});r.uniforms.tEquirect.value=t;let a=new We(s,r),o=t.minFilter;return t.minFilter===Dn&&(t.minFilter=et),new xa(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function J0(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,m=!1){return u==null?null:m?a(u):r(u)}function r(u){if(u&&u.isTexture){let m=u.mapping;if(m===Ma||m===ba)if(e.has(u)){let v=e.get(u).texture;return o(v,u.mapping)}else{let v=u.image;if(v&&v.height>0){let g=new po(v.height);return g.fromEquirectangularTexture(i,u),e.set(u,g),u.addEventListener("dispose",c),o(g.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let m=u.mapping,v=m===Ma||m===ba,g=m===di||m===Pi;if(v||g){let f=t.get(u),d=f!==void 0?f.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==d)return n===null&&(n=new fo(i)),f=v?n.fromEquirectangular(u,f):n.fromCubemap(u,f),f.texture.pmremVersion=u.pmremVersion,t.set(u,f),f.texture;if(f!==void 0)return f.texture;{let x=u.image;return v&&x&&x.height>0||g&&x&&l(x)?(n===null&&(n=new fo(i)),f=v?n.fromEquirectangular(u):n.fromCubemap(u),f.texture.pmremVersion=u.pmremVersion,t.set(u,f),u.addEventListener("dispose",h),f.texture):null}}}return u}function o(u,m){return m===Ma?u.mapping=di:m===ba&&(u.mapping=Pi),u}function l(u){let m=0,v=6;for(let g=0;g<v;g++)u[g]!==void 0&&m++;return m===v}function c(u){let m=u.target;m.removeEventListener("dispose",c);let v=e.get(m);v!==void 0&&(e.delete(m),v.dispose())}function h(u){let m=u.target;m.removeEventListener("dispose",h);let v=t.get(m);v!==void 0&&(t.delete(m),v.dispose())}function p(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:p}}function j0(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Ds("WebGLRenderer: "+n+" extension not supported."),s}}}function Q0(i,e,t,n){let s={},r=new WeakMap;function a(p){let u=p.target;u.index!==null&&e.remove(u.index);for(let v in u.attributes)e.remove(u.attributes[v]);u.removeEventListener("dispose",a),delete s[u.id];let m=r.get(u);m&&(e.remove(m),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(p,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function l(p){let u=p.attributes;for(let m in u)e.update(u[m],i.ARRAY_BUFFER)}function c(p){let u=[],m=p.index,v=p.attributes.position,g=0;if(v===void 0)return;if(m!==null){let x=m.array;g=m.version;for(let M=0,b=x.length;M<b;M+=3){let A=x[M+0],w=x[M+1],C=x[M+2];u.push(A,w,w,C,C,A)}}else{let x=v.array;g=v.version;for(let M=0,b=x.length/3-1;M<b;M+=3){let A=M+0,w=M+1,C=M+2;u.push(A,w,w,C,C,A)}}let f=new(v.count>=65535?Us:Ns)(u,1);f.version=g;let d=r.get(p);d&&e.remove(d),r.set(p,f)}function h(p){let u=r.get(p);if(u){let m=p.index;m!==null&&u.version<m.version&&c(p)}else c(p);return r.get(p)}return{get:o,update:l,getWireframeAttribute:h}}function em(i,e,t){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,m){i.drawElements(n,m,r,u*a),t.update(m,n,1)}function c(u,m,v){v!==0&&(i.drawElementsInstanced(n,m,r,u*a,v),t.update(m,n,v))}function h(u,m,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,u,0,v);let f=0;for(let d=0;d<v;d++)f+=m[d];t.update(f,n,1)}function p(u,m,v,g){if(v===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let d=0;d<u.length;d++)c(u[d]/a,m[d],g[d]);else{f.multiDrawElementsInstancedWEBGL(n,m,0,r,u,0,g,0,v);let d=0;for(let x=0;x<v;x++)d+=m[x]*g[x];t.update(d,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=p}function tm(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:ze("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function nm(i,e,t){let n=new WeakMap,s=new Je;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==p){let S=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",S)};u!==void 0&&u.texture.dispose();let m=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],x=o.morphAttributes.color||[],M=0;m===!0&&(M=1),v===!0&&(M=2),g===!0&&(M=3);let b=o.attributes.position.count*M,A=1;b>e.maxTextureSize&&(A=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);let w=new Float32Array(b*A*4*p),C=new Ls(w,b,A,p);C.type=Vt,C.needsUpdate=!0;let _=M*4;for(let U=0;U<p;U++){let R=f[U],F=d[U],O=x[U],G=b*A*4*U;for(let H=0;H<R.count;H++){let V=H*_;m===!0&&(s.fromBufferAttribute(R,H),w[G+V+0]=s.x,w[G+V+1]=s.y,w[G+V+2]=s.z,w[G+V+3]=0),v===!0&&(s.fromBufferAttribute(F,H),w[G+V+4]=s.x,w[G+V+5]=s.y,w[G+V+6]=s.z,w[G+V+7]=0),g===!0&&(s.fromBufferAttribute(O,H),w[G+V+8]=s.x,w[G+V+9]=s.y,w[G+V+10]=s.z,w[G+V+11]=O.itemSize===4?s.w:1)}}u={count:p,texture:C,size:new Xe(b,A)},n.set(o,u),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];let v=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function im(i,e,t,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,p=c.geometry,u=e.get(c,p);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let m=c.skeleton;r.get(m)!==h&&(m.update(),r.set(m,h))}return u}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}var sm={[Sl]:"LINEAR_TONE_MAPPING",[wl]:"REINHARD_TONE_MAPPING",[Tl]:"CINEON_TONE_MAPPING",[Al]:"ACES_FILMIC_TONE_MAPPING",[Cl]:"AGX_TONE_MAPPING",[Rl]:"NEUTRAL_TONE_MAPPING",[El]:"CUSTOM_TONE_MAPPING"};function rm(i,e,t,n,s){let r=new yt(e,t,{type:i,depthBuffer:n,stencilBuffer:s}),a=new yt(e,t,{type:Pt,depthBuffer:!1,stencilBuffer:!1}),o=new lt;o.setAttribute("position",new Ct([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new Ct([0,2,0,0,2,0],2));let l=new ra({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new We(o,l),h=new cn(-1,1,1,-1,0,1),p=null,u=null,m=!1,v,g=null,f=[],d=!1;this.setSize=function(x,M){r.setSize(x,M),a.setSize(x,M);for(let b=0;b<f.length;b++){let A=f[b];A.setSize&&A.setSize(x,M)}},this.setEffects=function(x){f=x,d=f.length>0&&f[0].isRenderPass===!0;let M=r.width,b=r.height;for(let A=0;A<f.length;A++){let w=f[A];w.setSize&&w.setSize(M,b)}},this.begin=function(x,M){if(m||x.toneMapping===un&&f.length===0)return!1;if(g=M,M!==null){let b=M.width,A=M.height;(r.width!==b||r.height!==A)&&this.setSize(b,A)}return d===!1&&x.setRenderTarget(r),v=x.toneMapping,x.toneMapping=un,!0},this.hasRenderPass=function(){return d},this.end=function(x,M){x.toneMapping=v,m=!0;let b=r,A=a;for(let w=0;w<f.length;w++){let C=f[w];if(C.enabled!==!1&&(C.render(x,A,b,M),C.needsSwap!==!1)){let _=b;b=A,A=_}}if(p!==x.outputColorSpace||u!==x.toneMapping){p=x.outputColorSpace,u=x.toneMapping,l.defines={},nt.getTransfer(p)===ct&&(l.defines.SRGB_TRANSFER="");let w=sm[u];w&&(l.defines[w]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=b.texture,x.setRenderTarget(g),x.render(c,h),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}var lu=new Qt,Kl=new Pn(1,1),cu=new Ls,hu=new ta,uu=new ks,Wh=[],Xh=[],qh=new Float32Array(16),Yh=new Float32Array(9),Zh=new Float32Array(4);function vs(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Wh[s];if(r===void 0&&(r=new Float32Array(s),Wh[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function It(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Dt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function vo(i,e){let t=Xh[e];t===void 0&&(t=new Int32Array(e),Xh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function am(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function om(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;i.uniform2fv(this.addr,e),Dt(t,e)}}function lm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(It(t,e))return;i.uniform3fv(this.addr,e),Dt(t,e)}}function cm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;i.uniform4fv(this.addr,e),Dt(t,e)}}function hm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(It(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(It(t,n))return;Zh.set(n),i.uniformMatrix2fv(this.addr,!1,Zh),Dt(t,n)}}function um(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(It(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(It(t,n))return;Yh.set(n),i.uniformMatrix3fv(this.addr,!1,Yh),Dt(t,n)}}function fm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(It(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(It(t,n))return;qh.set(n),i.uniformMatrix4fv(this.addr,!1,qh),Dt(t,n)}}function dm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function pm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;i.uniform2iv(this.addr,e),Dt(t,e)}}function mm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;i.uniform3iv(this.addr,e),Dt(t,e)}}function gm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;i.uniform4iv(this.addr,e),Dt(t,e)}}function vm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function xm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;i.uniform2uiv(this.addr,e),Dt(t,e)}}function _m(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;i.uniform3uiv(this.addr,e),Dt(t,e)}}function ym(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;i.uniform4uiv(this.addr,e),Dt(t,e)}}function Mm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Kl.compareFunction=t.isReversedDepthBuffer()?co:lo,r=Kl):r=lu,t.setTexture2D(e||r,s)}function bm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||hu,s)}function Sm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||uu,s)}function wm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||cu,s)}function Tm(i){switch(i){case 5126:return am;case 35664:return om;case 35665:return lm;case 35666:return cm;case 35674:return hm;case 35675:return um;case 35676:return fm;case 5124:case 35670:return dm;case 35667:case 35671:return pm;case 35668:case 35672:return mm;case 35669:case 35673:return gm;case 5125:return vm;case 36294:return xm;case 36295:return _m;case 36296:return ym;case 35678:case 36198:case 36298:case 36306:case 35682:return Mm;case 35679:case 36299:case 36307:return bm;case 35680:case 36300:case 36308:case 36293:return Sm;case 36289:case 36303:case 36311:case 36292:return wm}}function Am(i,e){i.uniform1fv(this.addr,e)}function Em(i,e){let t=vs(e,this.size,2);i.uniform2fv(this.addr,t)}function Cm(i,e){let t=vs(e,this.size,3);i.uniform3fv(this.addr,t)}function Rm(i,e){let t=vs(e,this.size,4);i.uniform4fv(this.addr,t)}function Pm(i,e){let t=vs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Im(i,e){let t=vs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Dm(i,e){let t=vs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Lm(i,e){i.uniform1iv(this.addr,e)}function Fm(i,e){i.uniform2iv(this.addr,e)}function Nm(i,e){i.uniform3iv(this.addr,e)}function Um(i,e){i.uniform4iv(this.addr,e)}function Om(i,e){i.uniform1uiv(this.addr,e)}function Bm(i,e){i.uniform2uiv(this.addr,e)}function zm(i,e){i.uniform3uiv(this.addr,e)}function km(i,e){i.uniform4uiv(this.addr,e)}function Gm(i,e,t){let n=this.cache,s=e.length,r=vo(t,s);It(n,r)||(i.uniform1iv(this.addr,r),Dt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Kl:a=lu;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Vm(i,e,t){let n=this.cache,s=e.length,r=vo(t,s);It(n,r)||(i.uniform1iv(this.addr,r),Dt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||hu,r[a])}function Hm(i,e,t){let n=this.cache,s=e.length,r=vo(t,s);It(n,r)||(i.uniform1iv(this.addr,r),Dt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||uu,r[a])}function Wm(i,e,t){let n=this.cache,s=e.length,r=vo(t,s);It(n,r)||(i.uniform1iv(this.addr,r),Dt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||cu,r[a])}function Xm(i){switch(i){case 5126:return Am;case 35664:return Em;case 35665:return Cm;case 35666:return Rm;case 35674:return Pm;case 35675:return Im;case 35676:return Dm;case 5124:case 35670:return Lm;case 35667:case 35671:return Fm;case 35668:case 35672:return Nm;case 35669:case 35673:return Um;case 5125:return Om;case 36294:return Bm;case 36295:return zm;case 36296:return km;case 35678:case 36198:case 36298:case 36306:case 35682:return Gm;case 35679:case 36299:case 36307:return Vm;case 35680:case 36300:case 36308:case 36293:return Hm;case 36289:case 36303:case 36311:case 36292:return Wm}}var $l=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Tm(t.type)}},Jl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Xm(t.type)}},jl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Yl=/(\w+)(\])?(\[|\.)?/g;function Kh(i,e){i.seq.push(e),i.map[e.id]=e}function qm(i,e,t){let n=i.name,s=n.length;for(Yl.lastIndex=0;;){let r=Yl.exec(n),a=Yl.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Kh(t,c===void 0?new $l(o,i,e):new Jl(o,i,e));break}else{let p=t.map[o];p===void 0&&(p=new jl(o),Kh(t,p)),t=p}}}var gs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);qm(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function $h(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Ym=37297,Zm=0;function Km(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Jh=new Ye;function $m(i){nt._getMatrix(Jh,nt.workingColorSpace,i);let e=`mat3( ${Jh.elements.map(t=>t.toFixed(4))} )`;switch(nt.getTransfer(i)){case Rs:return[e,"LinearTransferOETF"];case ct:return[e,"sRGBTransferOETF"];default:return ke("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function jh(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Km(i.getShaderSource(e),o)}else return r}function Jm(i,e){let t=$m(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var jm={[Sl]:"Linear",[wl]:"Reinhard",[Tl]:"Cineon",[Al]:"ACESFilmic",[Cl]:"AgX",[Rl]:"Neutral",[El]:"Custom"};function Qm(i,e){let t=jm[e];return t===void 0?(ke("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var uo=new D;function eg(){nt.getLuminanceCoefficients(uo);let i=uo.x.toFixed(4),e=uo.y.toFixed(4),t=uo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function tg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ir).join(`
`)}function ng(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ig(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ir(i){return i!==""}function Qh(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function eu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var sg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ql(i){return i.replace(sg,ag)}var rg=new Map;function ag(i,e){let t=Ke[e];if(t===void 0){let n=rg.get(e);if(n!==void 0)t=Ke[n],ke('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ql(t)}var og=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function tu(i){return i.replace(og,lg)}function lg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function nu(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var cg={[qs]:"SHADOWMAP_TYPE_PCF",[fs]:"SHADOWMAP_TYPE_VSM"};function hg(i){return cg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var ug={[di]:"ENVMAP_TYPE_CUBE",[Pi]:"ENVMAP_TYPE_CUBE",[Zs]:"ENVMAP_TYPE_CUBE_UV"};function fg(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":ug[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var dg={[Pi]:"ENVMAP_MODE_REFRACTION"};function pg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":dg[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var mg={[bl]:"ENVMAP_BLENDING_MULTIPLY",[yh]:"ENVMAP_BLENDING_MIX",[Mh]:"ENVMAP_BLENDING_ADD"};function gg(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":mg[i.combine]||"ENVMAP_BLENDING_NONE"}function vg(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function xg(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=hg(t),c=fg(t),h=pg(t),p=gg(t),u=vg(t),m=tg(t),v=ng(r),g=s.createProgram(),f,d,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(ir).join(`
`),f.length>0&&(f+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(ir).join(`
`),d.length>0&&(d+=`
`)):(f=[nu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ir).join(`
`),d=[nu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+p:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==un?"#define TONE_MAPPING":"",t.toneMapping!==un?Ke.tonemapping_pars_fragment:"",t.toneMapping!==un?Qm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,Jm("linearToOutputTexel",t.outputColorSpace),eg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ir).join(`
`)),a=Ql(a),a=Qh(a,t),a=eu(a,t),o=Ql(o),o=Qh(o,t),o=eu(o,t),a=tu(a),o=tu(o),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,d=["#define varying in",t.glslVersion===Ol?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ol?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let M=x+f+a,b=x+d+o,A=$h(s,s.VERTEX_SHADER,M),w=$h(s,s.FRAGMENT_SHADER,b);s.attachShader(g,A),s.attachShader(g,w),t.index0AttributeName!==void 0?s.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function C(R){if(i.debug.checkShaderErrors){let F=s.getProgramInfoLog(g)||"",O=s.getShaderInfoLog(A)||"",G=s.getShaderInfoLog(w)||"",H=F.trim(),V=O.trim(),W=G.trim(),re=!0,se=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(re=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,A,w);else{let ge=jh(s,A,"vertex"),ye=jh(s,w,"fragment");ze("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+H+`
`+ge+`
`+ye)}else H!==""?ke("WebGLProgram: Program Info Log:",H):(V===""||W==="")&&(se=!1);se&&(R.diagnostics={runnable:re,programLog:H,vertexShader:{log:V,prefix:f},fragmentShader:{log:W,prefix:d}})}s.deleteShader(A),s.deleteShader(w),_=new gs(s,g),S=ig(s,g)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let S;this.getAttributes=function(){return S===void 0&&C(this),S};let U=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return U===!1&&(U=s.getProgramParameter(g,Ym)),U},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Zm++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=A,this.fragmentShader=w,this}var _g=0,ec=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new tc(e),t.set(e,n)),n}},tc=class{constructor(e){this.id=_g++,this.code=e,this.usedTimes=0}};function yg(i,e,t,n,s,r){let a=new Fs,o=new ec,l=new Set,c=[],h=new Map,p=n.logarithmicDepthBuffer,u=n.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(_){return l.add(_),_===0?"uv":`uv${_}`}function g(_,S,U,R,F){let O=R.fog,G=F.geometry,H=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?R.environment:null,V=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,W=e.get(_.envMap||H,V),re=W&&W.mapping===Zs?W.image.height:null,se=m[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&ke("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));let ge=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ye=ge!==void 0?ge.length:0,me=0;G.morphAttributes.position!==void 0&&(me=1),G.morphAttributes.normal!==void 0&&(me=2),G.morphAttributes.color!==void 0&&(me=3);let Be,st,rt,Z;if(se){let tt=Fn[se];Be=tt.vertexShader,st=tt.fragmentShader}else Be=_.vertexShader,st=_.fragmentShader,o.update(_),rt=o.getVertexShaderID(_),Z=o.getFragmentShaderID(_);let ae=i.getRenderTarget(),fe=i.state.buffers.depth.getReversed(),k=F.isInstancedMesh===!0,oe=F.isBatchedMesh===!0,ue=!!_.map,Me=!!_.matcap,he=!!W,Se=!!_.aoMap,be=!!_.lightMap,pe=!!_.bumpMap,De=!!_.normalMap,P=!!_.displacementMap,it=!!_.emissiveMap,Ve=!!_.metalnessMap,je=!!_.roughnessMap,Ee=_.anisotropy>0,E=_.clearcoat>0,y=_.dispersion>0,N=_.iridescence>0,j=_.sheen>0,Q=_.transmission>0,K=Ee&&!!_.anisotropyMap,we=E&&!!_.clearcoatMap,de=E&&!!_.clearcoatNormalMap,Le=E&&!!_.clearcoatRoughnessMap,Oe=N&&!!_.iridescenceMap,L=N&&!!_.iridescenceThicknessMap,B=j&&!!_.sheenColorMap,J=j&&!!_.sheenRoughnessMap,ie=!!_.specularMap,ee=!!_.specularColorMap,Re=!!_.specularIntensityMap,I=Q&&!!_.transmissionMap,te=Q&&!!_.thicknessMap,ne=!!_.gradientMap,Te=!!_.alphaMap,le=_.alphaTest>0,$=!!_.alphaHash,Ae=!!_.extensions,Ue=un;_.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(Ue=i.toneMapping);let pt={shaderID:se,shaderType:_.type,shaderName:_.name,vertexShader:Be,fragmentShader:st,defines:_.defines,customVertexShaderID:rt,customFragmentShaderID:Z,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:oe,batchingColor:oe&&F._colorsTexture!==null,instancing:k,instancingColor:k&&F.instanceColor!==null,instancingMorph:k&&F.morphTexture!==null,outputColorSpace:ae===null?i.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:qn,alphaToCoverage:!!_.alphaToCoverage,map:ue,matcap:Me,envMap:he,envMapMode:he&&W.mapping,envMapCubeUVHeight:re,aoMap:Se,lightMap:be,bumpMap:pe,normalMap:De,displacementMap:P,emissiveMap:it,normalMapObjectSpace:De&&_.normalMapType===Th,normalMapTangentSpace:De&&_.normalMapType===wh,metalnessMap:Ve,roughnessMap:je,anisotropy:Ee,anisotropyMap:K,clearcoat:E,clearcoatMap:we,clearcoatNormalMap:de,clearcoatRoughnessMap:Le,dispersion:y,iridescence:N,iridescenceMap:Oe,iridescenceThicknessMap:L,sheen:j,sheenColorMap:B,sheenRoughnessMap:J,specularMap:ie,specularColorMap:ee,specularIntensityMap:Re,transmission:Q,transmissionMap:I,thicknessMap:te,gradientMap:ne,opaque:_.transparent===!1&&_.blending===Ai&&_.alphaToCoverage===!1,alphaMap:Te,alphaTest:le,alphaHash:$,combine:_.combine,mapUv:ue&&v(_.map.channel),aoMapUv:Se&&v(_.aoMap.channel),lightMapUv:be&&v(_.lightMap.channel),bumpMapUv:pe&&v(_.bumpMap.channel),normalMapUv:De&&v(_.normalMap.channel),displacementMapUv:P&&v(_.displacementMap.channel),emissiveMapUv:it&&v(_.emissiveMap.channel),metalnessMapUv:Ve&&v(_.metalnessMap.channel),roughnessMapUv:je&&v(_.roughnessMap.channel),anisotropyMapUv:K&&v(_.anisotropyMap.channel),clearcoatMapUv:we&&v(_.clearcoatMap.channel),clearcoatNormalMapUv:de&&v(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Le&&v(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Oe&&v(_.iridescenceMap.channel),iridescenceThicknessMapUv:L&&v(_.iridescenceThicknessMap.channel),sheenColorMapUv:B&&v(_.sheenColorMap.channel),sheenRoughnessMapUv:J&&v(_.sheenRoughnessMap.channel),specularMapUv:ie&&v(_.specularMap.channel),specularColorMapUv:ee&&v(_.specularColorMap.channel),specularIntensityMapUv:Re&&v(_.specularIntensityMap.channel),transmissionMapUv:I&&v(_.transmissionMap.channel),thicknessMapUv:te&&v(_.thicknessMap.channel),alphaMapUv:Te&&v(_.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(De||Ee),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!G.attributes.uv&&(ue||Te),fog:!!O,useFog:_.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||G.attributes.normal===void 0&&De===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:fe,skinning:F.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:me,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&U.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ue,decodeVideoTexture:ue&&_.map.isVideoTexture===!0&&nt.getTransfer(_.map.colorSpace)===ct,decodeVideoTextureEmissive:it&&_.emissiveMap.isVideoTexture===!0&&nt.getTransfer(_.emissiveMap.colorSpace)===ct,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===In,flipSided:_.side===Jt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Ae&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ae&&_.extensions.multiDraw===!0||oe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return pt.vertexUv1s=l.has(1),pt.vertexUv2s=l.has(2),pt.vertexUv3s=l.has(3),l.clear(),pt}function f(_){let S=[];if(_.shaderID?S.push(_.shaderID):(S.push(_.customVertexShaderID),S.push(_.customFragmentShaderID)),_.defines!==void 0)for(let U in _.defines)S.push(U),S.push(_.defines[U]);return _.isRawShaderMaterial===!1&&(d(S,_),x(S,_),S.push(i.outputColorSpace)),S.push(_.customProgramCacheKey),S.join()}function d(_,S){_.push(S.precision),_.push(S.outputColorSpace),_.push(S.envMapMode),_.push(S.envMapCubeUVHeight),_.push(S.mapUv),_.push(S.alphaMapUv),_.push(S.lightMapUv),_.push(S.aoMapUv),_.push(S.bumpMapUv),_.push(S.normalMapUv),_.push(S.displacementMapUv),_.push(S.emissiveMapUv),_.push(S.metalnessMapUv),_.push(S.roughnessMapUv),_.push(S.anisotropyMapUv),_.push(S.clearcoatMapUv),_.push(S.clearcoatNormalMapUv),_.push(S.clearcoatRoughnessMapUv),_.push(S.iridescenceMapUv),_.push(S.iridescenceThicknessMapUv),_.push(S.sheenColorMapUv),_.push(S.sheenRoughnessMapUv),_.push(S.specularMapUv),_.push(S.specularColorMapUv),_.push(S.specularIntensityMapUv),_.push(S.transmissionMapUv),_.push(S.thicknessMapUv),_.push(S.combine),_.push(S.fogExp2),_.push(S.sizeAttenuation),_.push(S.morphTargetsCount),_.push(S.morphAttributeCount),_.push(S.numDirLights),_.push(S.numPointLights),_.push(S.numSpotLights),_.push(S.numSpotLightMaps),_.push(S.numHemiLights),_.push(S.numRectAreaLights),_.push(S.numDirLightShadows),_.push(S.numPointLightShadows),_.push(S.numSpotLightShadows),_.push(S.numSpotLightShadowsWithMaps),_.push(S.numLightProbes),_.push(S.shadowMapType),_.push(S.toneMapping),_.push(S.numClippingPlanes),_.push(S.numClipIntersection),_.push(S.depthPacking)}function x(_,S){a.disableAll(),S.instancing&&a.enable(0),S.instancingColor&&a.enable(1),S.instancingMorph&&a.enable(2),S.matcap&&a.enable(3),S.envMap&&a.enable(4),S.normalMapObjectSpace&&a.enable(5),S.normalMapTangentSpace&&a.enable(6),S.clearcoat&&a.enable(7),S.iridescence&&a.enable(8),S.alphaTest&&a.enable(9),S.vertexColors&&a.enable(10),S.vertexAlphas&&a.enable(11),S.vertexUv1s&&a.enable(12),S.vertexUv2s&&a.enable(13),S.vertexUv3s&&a.enable(14),S.vertexTangents&&a.enable(15),S.anisotropy&&a.enable(16),S.alphaHash&&a.enable(17),S.batching&&a.enable(18),S.dispersion&&a.enable(19),S.batchingColor&&a.enable(20),S.gradientMap&&a.enable(21),_.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),_.push(a.mask)}function M(_){let S=m[_.type],U;if(S){let R=Fn[S];U=Oh.clone(R.uniforms)}else U=_.uniforms;return U}function b(_,S){let U=h.get(S);return U!==void 0?++U.usedTimes:(U=new xg(i,S,_,s),c.push(U),h.set(S,U)),U}function A(_){if(--_.usedTimes===0){let S=c.indexOf(_);c[S]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function w(_){o.remove(_)}function C(){o.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:M,acquireProgram:b,releaseProgram:A,releaseShaderCache:w,programs:c,dispose:C}}function Mg(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function bg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function iu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function su(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u){let m=0;return u.isInstancedMesh&&(m+=2),u.isSkinnedMesh&&(m+=1),m}function o(u,m,v,g,f,d){let x=i[e];return x===void 0?(x={id:u.id,object:u,geometry:m,material:v,materialVariant:a(u),groupOrder:g,renderOrder:u.renderOrder,z:f,group:d},i[e]=x):(x.id=u.id,x.object=u,x.geometry=m,x.material=v,x.materialVariant=a(u),x.groupOrder=g,x.renderOrder=u.renderOrder,x.z=f,x.group=d),e++,x}function l(u,m,v,g,f,d){let x=o(u,m,v,g,f,d);v.transmission>0?n.push(x):v.transparent===!0?s.push(x):t.push(x)}function c(u,m,v,g,f,d){let x=o(u,m,v,g,f,d);v.transmission>0?n.unshift(x):v.transparent===!0?s.unshift(x):t.unshift(x)}function h(u,m){t.length>1&&t.sort(u||bg),n.length>1&&n.sort(m||iu),s.length>1&&s.sort(m||iu)}function p(){for(let u=e,m=i.length;u<m;u++){let v=i[u];if(v.id===null)break;v.id=null,v.object=null,v.geometry=null,v.material=null,v.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:p,sort:h}}function Sg(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new su,i.set(n,[a])):s>=r.length?(a=new su,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function wg(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new ot};break;case"SpotLight":t={position:new D,direction:new D,color:new ot,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new ot,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new ot,groundColor:new ot};break;case"RectAreaLight":t={color:new ot,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function Tg(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Ag=0;function Eg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Cg(i){let e=new wg,t=Tg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);let s=new D,r=new ht,a=new ht;function o(c){let h=0,p=0,u=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let m=0,v=0,g=0,f=0,d=0,x=0,M=0,b=0,A=0,w=0,C=0;c.sort(Eg);for(let S=0,U=c.length;S<U;S++){let R=c[S],F=R.color,O=R.intensity,G=R.distance,H=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Kn?H=R.shadow.map.texture:H=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=F.r*O,p+=F.g*O,u+=F.b*O;else if(R.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(R.sh.coefficients[V],O);C++}else if(R.isDirectionalLight){let V=e.get(R);if(V.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let W=R.shadow,re=t.get(R);re.shadowIntensity=W.intensity,re.shadowBias=W.bias,re.shadowNormalBias=W.normalBias,re.shadowRadius=W.radius,re.shadowMapSize=W.mapSize,n.directionalShadow[m]=re,n.directionalShadowMap[m]=H,n.directionalShadowMatrix[m]=R.shadow.matrix,x++}n.directional[m]=V,m++}else if(R.isSpotLight){let V=e.get(R);V.position.setFromMatrixPosition(R.matrixWorld),V.color.copy(F).multiplyScalar(O),V.distance=G,V.coneCos=Math.cos(R.angle),V.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),V.decay=R.decay,n.spot[g]=V;let W=R.shadow;if(R.map&&(n.spotLightMap[A]=R.map,A++,W.updateMatrices(R),R.castShadow&&w++),n.spotLightMatrix[g]=W.matrix,R.castShadow){let re=t.get(R);re.shadowIntensity=W.intensity,re.shadowBias=W.bias,re.shadowNormalBias=W.normalBias,re.shadowRadius=W.radius,re.shadowMapSize=W.mapSize,n.spotShadow[g]=re,n.spotShadowMap[g]=H,b++}g++}else if(R.isRectAreaLight){let V=e.get(R);V.color.copy(F).multiplyScalar(O),V.halfWidth.set(R.width*.5,0,0),V.halfHeight.set(0,R.height*.5,0),n.rectArea[f]=V,f++}else if(R.isPointLight){let V=e.get(R);if(V.color.copy(R.color).multiplyScalar(R.intensity),V.distance=R.distance,V.decay=R.decay,R.castShadow){let W=R.shadow,re=t.get(R);re.shadowIntensity=W.intensity,re.shadowBias=W.bias,re.shadowNormalBias=W.normalBias,re.shadowRadius=W.radius,re.shadowMapSize=W.mapSize,re.shadowCameraNear=W.camera.near,re.shadowCameraFar=W.camera.far,n.pointShadow[v]=re,n.pointShadowMap[v]=H,n.pointShadowMatrix[v]=R.shadow.matrix,M++}n.point[v]=V,v++}else if(R.isHemisphereLight){let V=e.get(R);V.skyColor.copy(R.color).multiplyScalar(O),V.groundColor.copy(R.groundColor).multiplyScalar(O),n.hemi[d]=V,d++}}f>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=p,n.ambient[2]=u;let _=n.hash;(_.directionalLength!==m||_.pointLength!==v||_.spotLength!==g||_.rectAreaLength!==f||_.hemiLength!==d||_.numDirectionalShadows!==x||_.numPointShadows!==M||_.numSpotShadows!==b||_.numSpotMaps!==A||_.numLightProbes!==C)&&(n.directional.length=m,n.spot.length=g,n.rectArea.length=f,n.point.length=v,n.hemi.length=d,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=b+A-w,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=C,_.directionalLength=m,_.pointLength=v,_.spotLength=g,_.rectAreaLength=f,_.hemiLength=d,_.numDirectionalShadows=x,_.numPointShadows=M,_.numSpotShadows=b,_.numSpotMaps=A,_.numLightProbes=C,n.version=Ag++)}function l(c,h){let p=0,u=0,m=0,v=0,g=0,f=h.matrixWorldInverse;for(let d=0,x=c.length;d<x;d++){let M=c[d];if(M.isDirectionalLight){let b=n.directional[p];b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(f),p++}else if(M.isSpotLight){let b=n.spot[m];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(f),b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(f),m++}else if(M.isRectAreaLight){let b=n.rectArea[v];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(f),a.identity(),r.copy(M.matrixWorld),r.premultiply(f),a.extractRotation(r),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),v++}else if(M.isPointLight){let b=n.point[u];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(f),u++}else if(M.isHemisphereLight){let b=n.hemi[g];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(f),g++}}}return{setup:o,setupView:l,state:n}}function ru(i){let e=new Cg(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Rg(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new ru(i),e.set(s,[o])):r>=a.length?(o=new ru(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var Pg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ig=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Dg=[new D(1,0,0),new D(-1,0,0),new D(0,1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1)],Lg=[new D(0,-1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1),new D(0,-1,0),new D(0,-1,0)],au=new ht,nr=new D,Zl=new D;function Fg(i,e,t){let n=new zs,s=new Xe,r=new Xe,a=new Je,o=new aa,l=new oa,c={},h=t.maxTextureSize,p={[Xn]:Jt,[Jt]:Xn,[In]:In},u=new Ge({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xe},radius:{value:4}},vertexShader:Pg,fragmentShader:Ig}),m=u.clone();m.defines.HORIZONTAL_PASS=1;let v=new lt;v.setAttribute("position",new He(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new We(v,u),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qs;let d=this.type;this.render=function(w,C,_){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||w.length===0)return;this.type===ih&&(ke("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=qs);let S=i.getRenderTarget(),U=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),F=i.state;F.setBlending(hn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let O=d!==this.type;O&&C.traverse(function(G){G.material&&(Array.isArray(G.material)?G.material.forEach(H=>H.needsUpdate=!0):G.material.needsUpdate=!0)});for(let G=0,H=w.length;G<H;G++){let V=w[G],W=V.shadow;if(W===void 0){ke("WebGLShadowMap:",V,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);let re=W.getFrameExtents();s.multiply(re),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/re.x),s.x=r.x*re.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/re.y),s.y=r.y*re.y,W.mapSize.y=r.y));let se=i.state.buffers.depth.getReversed();if(W.camera._reversedDepth=se,W.map===null||O===!0){if(W.map!==null&&(W.map.depthTexture!==null&&(W.map.depthTexture.dispose(),W.map.depthTexture=null),W.map.dispose()),this.type===fs){if(V.isPointLight){ke("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}W.map=new yt(s.x,s.y,{format:Kn,type:Pt,minFilter:et,magFilter:et,generateMipmaps:!1}),W.map.texture.name=V.name+".shadowMap",W.map.depthTexture=new Pn(s.x,s.y,Vt),W.map.depthTexture.name=V.name+".shadowMapDepth",W.map.depthTexture.format=An,W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=xt,W.map.depthTexture.magFilter=xt}else V.isPointLight?(W.map=new po(s.x),W.map.depthTexture=new ia(s.x,yn)):(W.map=new yt(s.x,s.y),W.map.depthTexture=new Pn(s.x,s.y,yn)),W.map.depthTexture.name=V.name+".shadowMap",W.map.depthTexture.format=An,this.type===qs?(W.map.depthTexture.compareFunction=se?co:lo,W.map.depthTexture.minFilter=et,W.map.depthTexture.magFilter=et):(W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=xt,W.map.depthTexture.magFilter=xt);W.camera.updateProjectionMatrix()}let ge=W.map.isWebGLCubeRenderTarget?6:1;for(let ye=0;ye<ge;ye++){if(W.map.isWebGLCubeRenderTarget)i.setRenderTarget(W.map,ye),i.clear();else{ye===0&&(i.setRenderTarget(W.map),i.clear());let me=W.getViewport(ye);a.set(r.x*me.x,r.y*me.y,r.x*me.z,r.y*me.w),F.viewport(a)}if(V.isPointLight){let me=W.camera,Be=W.matrix,st=V.distance||me.far;st!==me.far&&(me.far=st,me.updateProjectionMatrix()),nr.setFromMatrixPosition(V.matrixWorld),me.position.copy(nr),Zl.copy(me.position),Zl.add(Dg[ye]),me.up.copy(Lg[ye]),me.lookAt(Zl),me.updateMatrixWorld(),Be.makeTranslation(-nr.x,-nr.y,-nr.z),au.multiplyMatrices(me.projectionMatrix,me.matrixWorldInverse),W._frustum.setFromProjectionMatrix(au,me.coordinateSystem,me.reversedDepth)}else W.updateMatrices(V);n=W.getFrustum(),b(C,_,W.camera,V,this.type)}W.isPointLightShadow!==!0&&this.type===fs&&x(W,_),W.needsUpdate=!1}d=this.type,f.needsUpdate=!1,i.setRenderTarget(S,U,R)};function x(w,C){let _=e.update(g);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new yt(s.x,s.y,{format:Kn,type:Pt})),u.uniforms.shadow_pass.value=w.map.depthTexture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(C,null,_,u,g,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(C,null,_,m,g,null)}function M(w,C,_,S){let U=null,R=_.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(R!==void 0)U=R;else if(U=_.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let F=U.uuid,O=C.uuid,G=c[F];G===void 0&&(G={},c[F]=G);let H=G[O];H===void 0&&(H=U.clone(),G[O]=H,C.addEventListener("dispose",A)),U=H}if(U.visible=C.visible,U.wireframe=C.wireframe,S===fs?U.side=C.shadowSide!==null?C.shadowSide:C.side:U.side=C.shadowSide!==null?C.shadowSide:p[C.side],U.alphaMap=C.alphaMap,U.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,U.map=C.map,U.clipShadows=C.clipShadows,U.clippingPlanes=C.clippingPlanes,U.clipIntersection=C.clipIntersection,U.displacementMap=C.displacementMap,U.displacementScale=C.displacementScale,U.displacementBias=C.displacementBias,U.wireframeLinewidth=C.wireframeLinewidth,U.linewidth=C.linewidth,_.isPointLight===!0&&U.isMeshDistanceMaterial===!0){let F=i.properties.get(U);F.light=_}return U}function b(w,C,_,S,U){if(w.visible===!1)return;if(w.layers.test(C.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&U===fs)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,w.matrixWorld);let O=e.update(w),G=w.material;if(Array.isArray(G)){let H=O.groups;for(let V=0,W=H.length;V<W;V++){let re=H[V],se=G[re.materialIndex];if(se&&se.visible){let ge=M(w,se,S,U);w.onBeforeShadow(i,w,C,_,O,ge,re),i.renderBufferDirect(_,null,O,ge,w,re),w.onAfterShadow(i,w,C,_,O,ge,re)}}}else if(G.visible){let H=M(w,G,S,U);w.onBeforeShadow(i,w,C,_,O,H,null),i.renderBufferDirect(_,null,O,H,w,null),w.onAfterShadow(i,w,C,_,O,H,null)}}let F=w.children;for(let O=0,G=F.length;O<G;O++)b(F[O],C,_,S,U)}function A(w){w.target.removeEventListener("dispose",A);for(let _ in c){let S=c[_],U=w.target.uuid;U in S&&(S[U].dispose(),delete S[U])}}}function Ng(i,e){function t(){let I=!1,te=new Je,ne=null,Te=new Je(0,0,0,0);return{setMask:function(le){ne!==le&&!I&&(i.colorMask(le,le,le,le),ne=le)},setLocked:function(le){I=le},setClear:function(le,$,Ae,Ue,pt){pt===!0&&(le*=Ue,$*=Ue,Ae*=Ue),te.set(le,$,Ae,Ue),Te.equals(te)===!1&&(i.clearColor(le,$,Ae,Ue),Te.copy(te))},reset:function(){I=!1,ne=null,Te.set(-1,0,0,0)}}}function n(){let I=!1,te=!1,ne=null,Te=null,le=null;return{setReversed:function($){if(te!==$){let Ae=e.get("EXT_clip_control");$?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),te=$;let Ue=le;le=null,this.setClear(Ue)}},getReversed:function(){return te},setTest:function($){$?ae(i.DEPTH_TEST):fe(i.DEPTH_TEST)},setMask:function($){ne!==$&&!I&&(i.depthMask($),ne=$)},setFunc:function($){if(te&&($=Nh[$]),Te!==$){switch($){case Hr:i.depthFunc(i.NEVER);break;case Wr:i.depthFunc(i.ALWAYS);break;case Xr:i.depthFunc(i.LESS);break;case Ei:i.depthFunc(i.LEQUAL);break;case qr:i.depthFunc(i.EQUAL);break;case Yr:i.depthFunc(i.GEQUAL);break;case Zr:i.depthFunc(i.GREATER);break;case Kr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Te=$}},setLocked:function($){I=$},setClear:function($){le!==$&&(le=$,te&&($=1-$),i.clearDepth($))},reset:function(){I=!1,ne=null,Te=null,le=null,te=!1}}}function s(){let I=!1,te=null,ne=null,Te=null,le=null,$=null,Ae=null,Ue=null,pt=null;return{setTest:function(tt){I||(tt?ae(i.STENCIL_TEST):fe(i.STENCIL_TEST))},setMask:function(tt){te!==tt&&!I&&(i.stencilMask(tt),te=tt)},setFunc:function(tt,Un,On){(ne!==tt||Te!==Un||le!==On)&&(i.stencilFunc(tt,Un,On),ne=tt,Te=Un,le=On)},setOp:function(tt,Un,On){($!==tt||Ae!==Un||Ue!==On)&&(i.stencilOp(tt,Un,On),$=tt,Ae=Un,Ue=On)},setLocked:function(tt){I=tt},setClear:function(tt){pt!==tt&&(i.clearStencil(tt),pt=tt)},reset:function(){I=!1,te=null,ne=null,Te=null,le=null,$=null,Ae=null,Ue=null,pt=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},p={},u=new WeakMap,m=[],v=null,g=!1,f=null,d=null,x=null,M=null,b=null,A=null,w=null,C=new ot(0,0,0),_=0,S=!1,U=null,R=null,F=null,O=null,G=null,H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,W=0,re=i.getParameter(i.VERSION);re.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(re)[1]),V=W>=1):re.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(re)[1]),V=W>=2);let se=null,ge={},ye=i.getParameter(i.SCISSOR_BOX),me=i.getParameter(i.VIEWPORT),Be=new Je().fromArray(ye),st=new Je().fromArray(me);function rt(I,te,ne,Te){let le=new Uint8Array(4),$=i.createTexture();i.bindTexture(I,$),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ae=0;Ae<ne;Ae++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(te,0,i.RGBA,1,1,Te,0,i.RGBA,i.UNSIGNED_BYTE,le):i.texImage2D(te+Ae,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,le);return $}let Z={};Z[i.TEXTURE_2D]=rt(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=rt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=rt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=rt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ae(i.DEPTH_TEST),a.setFunc(Ei),pe(!1),De(_l),ae(i.CULL_FACE),Se(hn);function ae(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function fe(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function k(I,te){return p[I]!==te?(i.bindFramebuffer(I,te),p[I]=te,I===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=te),I===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=te),!0):!1}function oe(I,te){let ne=m,Te=!1;if(I){ne=u.get(te),ne===void 0&&(ne=[],u.set(te,ne));let le=I.textures;if(ne.length!==le.length||ne[0]!==i.COLOR_ATTACHMENT0){for(let $=0,Ae=le.length;$<Ae;$++)ne[$]=i.COLOR_ATTACHMENT0+$;ne.length=le.length,Te=!0}}else ne[0]!==i.BACK&&(ne[0]=i.BACK,Te=!0);Te&&i.drawBuffers(ne)}function ue(I){return v!==I?(i.useProgram(I),v=I,!0):!1}let Me={[Tn]:i.FUNC_ADD,[sh]:i.FUNC_SUBTRACT,[rh]:i.FUNC_REVERSE_SUBTRACT};Me[ah]=i.MIN,Me[oh]=i.MAX;let he={[lh]:i.ZERO,[Ys]:i.ONE,[ch]:i.SRC_COLOR,[Gr]:i.SRC_ALPHA,[mh]:i.SRC_ALPHA_SATURATE,[dh]:i.DST_COLOR,[uh]:i.DST_ALPHA,[hh]:i.ONE_MINUS_SRC_COLOR,[Vr]:i.ONE_MINUS_SRC_ALPHA,[ph]:i.ONE_MINUS_DST_COLOR,[fh]:i.ONE_MINUS_DST_ALPHA,[gh]:i.CONSTANT_COLOR,[vh]:i.ONE_MINUS_CONSTANT_COLOR,[xh]:i.CONSTANT_ALPHA,[_h]:i.ONE_MINUS_CONSTANT_ALPHA};function Se(I,te,ne,Te,le,$,Ae,Ue,pt,tt){if(I===hn){g===!0&&(fe(i.BLEND),g=!1);return}if(g===!1&&(ae(i.BLEND),g=!0),I!==ya){if(I!==f||tt!==S){if((d!==Tn||b!==Tn)&&(i.blendEquation(i.FUNC_ADD),d=Tn,b=Tn),tt)switch(I){case Ai:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Zn:i.blendFunc(i.ONE,i.ONE);break;case yl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ml:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:ze("WebGLState: Invalid blending: ",I);break}else switch(I){case Ai:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Zn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case yl:ze("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ml:ze("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ze("WebGLState: Invalid blending: ",I);break}x=null,M=null,A=null,w=null,C.set(0,0,0),_=0,f=I,S=tt}return}le=le||te,$=$||ne,Ae=Ae||Te,(te!==d||le!==b)&&(i.blendEquationSeparate(Me[te],Me[le]),d=te,b=le),(ne!==x||Te!==M||$!==A||Ae!==w)&&(i.blendFuncSeparate(he[ne],he[Te],he[$],he[Ae]),x=ne,M=Te,A=$,w=Ae),(Ue.equals(C)===!1||pt!==_)&&(i.blendColor(Ue.r,Ue.g,Ue.b,pt),C.copy(Ue),_=pt),f=I,S=!1}function be(I,te){I.side===In?fe(i.CULL_FACE):ae(i.CULL_FACE);let ne=I.side===Jt;te&&(ne=!ne),pe(ne),I.blending===Ai&&I.transparent===!1?Se(hn):Se(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);let Te=I.stencilWrite;o.setTest(Te),Te&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),it(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?ae(i.SAMPLE_ALPHA_TO_COVERAGE):fe(i.SAMPLE_ALPHA_TO_COVERAGE)}function pe(I){U!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),U=I)}function De(I){I!==th?(ae(i.CULL_FACE),I!==R&&(I===_l?i.cullFace(i.BACK):I===nh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):fe(i.CULL_FACE),R=I}function P(I){I!==F&&(V&&i.lineWidth(I),F=I)}function it(I,te,ne){I?(ae(i.POLYGON_OFFSET_FILL),(O!==te||G!==ne)&&(O=te,G=ne,a.getReversed()&&(te=-te),i.polygonOffset(te,ne))):fe(i.POLYGON_OFFSET_FILL)}function Ve(I){I?ae(i.SCISSOR_TEST):fe(i.SCISSOR_TEST)}function je(I){I===void 0&&(I=i.TEXTURE0+H-1),se!==I&&(i.activeTexture(I),se=I)}function Ee(I,te,ne){ne===void 0&&(se===null?ne=i.TEXTURE0+H-1:ne=se);let Te=ge[ne];Te===void 0&&(Te={type:void 0,texture:void 0},ge[ne]=Te),(Te.type!==I||Te.texture!==te)&&(se!==ne&&(i.activeTexture(ne),se=ne),i.bindTexture(I,te||Z[I]),Te.type=I,Te.texture=te)}function E(){let I=ge[se];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function y(){try{i.compressedTexImage2D(...arguments)}catch(I){ze("WebGLState:",I)}}function N(){try{i.compressedTexImage3D(...arguments)}catch(I){ze("WebGLState:",I)}}function j(){try{i.texSubImage2D(...arguments)}catch(I){ze("WebGLState:",I)}}function Q(){try{i.texSubImage3D(...arguments)}catch(I){ze("WebGLState:",I)}}function K(){try{i.compressedTexSubImage2D(...arguments)}catch(I){ze("WebGLState:",I)}}function we(){try{i.compressedTexSubImage3D(...arguments)}catch(I){ze("WebGLState:",I)}}function de(){try{i.texStorage2D(...arguments)}catch(I){ze("WebGLState:",I)}}function Le(){try{i.texStorage3D(...arguments)}catch(I){ze("WebGLState:",I)}}function Oe(){try{i.texImage2D(...arguments)}catch(I){ze("WebGLState:",I)}}function L(){try{i.texImage3D(...arguments)}catch(I){ze("WebGLState:",I)}}function B(I){Be.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),Be.copy(I))}function J(I){st.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),st.copy(I))}function ie(I,te){let ne=c.get(te);ne===void 0&&(ne=new WeakMap,c.set(te,ne));let Te=ne.get(I);Te===void 0&&(Te=i.getUniformBlockIndex(te,I.name),ne.set(I,Te))}function ee(I,te){let Te=c.get(te).get(I);l.get(te)!==Te&&(i.uniformBlockBinding(te,Te,I.__bindingPointIndex),l.set(te,Te))}function Re(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},se=null,ge={},p={},u=new WeakMap,m=[],v=null,g=!1,f=null,d=null,x=null,M=null,b=null,A=null,w=null,C=new ot(0,0,0),_=0,S=!1,U=null,R=null,F=null,O=null,G=null,Be.set(0,0,i.canvas.width,i.canvas.height),st.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ae,disable:fe,bindFramebuffer:k,drawBuffers:oe,useProgram:ue,setBlending:Se,setMaterial:be,setFlipSided:pe,setCullFace:De,setLineWidth:P,setPolygonOffset:it,setScissorTest:Ve,activeTexture:je,bindTexture:Ee,unbindTexture:E,compressedTexImage2D:y,compressedTexImage3D:N,texImage2D:Oe,texImage3D:L,updateUBOMapping:ie,uniformBlockBinding:ee,texStorage2D:de,texStorage3D:Le,texSubImage2D:j,texSubImage3D:Q,compressedTexSubImage2D:K,compressedTexSubImage3D:we,scissor:B,viewport:J,reset:Re}}function Ug(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Xe,h=new WeakMap,p,u=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(E,y){return m?new OffscreenCanvas(E,y):Is("canvas")}function g(E,y,N){let j=1,Q=Ee(E);if((Q.width>N||Q.height>N)&&(j=N/Math.max(Q.width,Q.height)),j<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){let K=Math.floor(j*Q.width),we=Math.floor(j*Q.height);p===void 0&&(p=v(K,we));let de=y?v(K,we):p;return de.width=K,de.height=we,de.getContext("2d").drawImage(E,0,0,K,we),ke("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+K+"x"+we+")."),de}else return"data"in E&&ke("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),E;return E}function f(E){return E.generateMipmaps}function d(E){i.generateMipmap(E)}function x(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(E,y,N,j,Q=!1){if(E!==null){if(i[E]!==void 0)return i[E];ke("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let K=y;if(y===i.RED&&(N===i.FLOAT&&(K=i.R32F),N===i.HALF_FLOAT&&(K=i.R16F),N===i.UNSIGNED_BYTE&&(K=i.R8)),y===i.RED_INTEGER&&(N===i.UNSIGNED_BYTE&&(K=i.R8UI),N===i.UNSIGNED_SHORT&&(K=i.R16UI),N===i.UNSIGNED_INT&&(K=i.R32UI),N===i.BYTE&&(K=i.R8I),N===i.SHORT&&(K=i.R16I),N===i.INT&&(K=i.R32I)),y===i.RG&&(N===i.FLOAT&&(K=i.RG32F),N===i.HALF_FLOAT&&(K=i.RG16F),N===i.UNSIGNED_BYTE&&(K=i.RG8)),y===i.RG_INTEGER&&(N===i.UNSIGNED_BYTE&&(K=i.RG8UI),N===i.UNSIGNED_SHORT&&(K=i.RG16UI),N===i.UNSIGNED_INT&&(K=i.RG32UI),N===i.BYTE&&(K=i.RG8I),N===i.SHORT&&(K=i.RG16I),N===i.INT&&(K=i.RG32I)),y===i.RGB_INTEGER&&(N===i.UNSIGNED_BYTE&&(K=i.RGB8UI),N===i.UNSIGNED_SHORT&&(K=i.RGB16UI),N===i.UNSIGNED_INT&&(K=i.RGB32UI),N===i.BYTE&&(K=i.RGB8I),N===i.SHORT&&(K=i.RGB16I),N===i.INT&&(K=i.RGB32I)),y===i.RGBA_INTEGER&&(N===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),N===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),N===i.UNSIGNED_INT&&(K=i.RGBA32UI),N===i.BYTE&&(K=i.RGBA8I),N===i.SHORT&&(K=i.RGBA16I),N===i.INT&&(K=i.RGBA32I)),y===i.RGB&&(N===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),N===i.UNSIGNED_INT_10F_11F_11F_REV&&(K=i.R11F_G11F_B10F)),y===i.RGBA){let we=Q?Rs:nt.getTransfer(j);N===i.FLOAT&&(K=i.RGBA32F),N===i.HALF_FLOAT&&(K=i.RGBA16F),N===i.UNSIGNED_BYTE&&(K=we===ct?i.SRGB8_ALPHA8:i.RGBA8),N===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),N===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function b(E,y){let N;return E?y===null||y===yn||y===ps?N=i.DEPTH24_STENCIL8:y===Vt?N=i.DEPTH32F_STENCIL8:y===ds&&(N=i.DEPTH24_STENCIL8,ke("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===yn||y===ps?N=i.DEPTH_COMPONENT24:y===Vt?N=i.DEPTH_COMPONENT32F:y===ds&&(N=i.DEPTH_COMPONENT16),N}function A(E,y){return f(E)===!0||E.isFramebufferTexture&&E.minFilter!==xt&&E.minFilter!==et?Math.log2(Math.max(y.width,y.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?y.mipmaps.length:1}function w(E){let y=E.target;y.removeEventListener("dispose",w),_(y),y.isVideoTexture&&h.delete(y)}function C(E){let y=E.target;y.removeEventListener("dispose",C),U(y)}function _(E){let y=n.get(E);if(y.__webglInit===void 0)return;let N=E.source,j=u.get(N);if(j){let Q=j[y.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&S(E),Object.keys(j).length===0&&u.delete(N)}n.remove(E)}function S(E){let y=n.get(E);i.deleteTexture(y.__webglTexture);let N=E.source,j=u.get(N);delete j[y.__cacheKey],a.memory.textures--}function U(E){let y=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(y.__webglFramebuffer[j]))for(let Q=0;Q<y.__webglFramebuffer[j].length;Q++)i.deleteFramebuffer(y.__webglFramebuffer[j][Q]);else i.deleteFramebuffer(y.__webglFramebuffer[j]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[j])}else{if(Array.isArray(y.__webglFramebuffer))for(let j=0;j<y.__webglFramebuffer.length;j++)i.deleteFramebuffer(y.__webglFramebuffer[j]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let j=0;j<y.__webglColorRenderbuffer.length;j++)y.__webglColorRenderbuffer[j]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[j]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let N=E.textures;for(let j=0,Q=N.length;j<Q;j++){let K=n.get(N[j]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),a.memory.textures--),n.remove(N[j])}n.remove(E)}let R=0;function F(){R=0}function O(){let E=R;return E>=s.maxTextures&&ke("WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),R+=1,E}function G(E){let y=[];return y.push(E.wrapS),y.push(E.wrapT),y.push(E.wrapR||0),y.push(E.magFilter),y.push(E.minFilter),y.push(E.anisotropy),y.push(E.internalFormat),y.push(E.format),y.push(E.type),y.push(E.generateMipmaps),y.push(E.premultiplyAlpha),y.push(E.flipY),y.push(E.unpackAlignment),y.push(E.colorSpace),y.join()}function H(E,y){let N=n.get(E);if(E.isVideoTexture&&Ve(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&N.__version!==E.version){let j=E.image;if(j===null)ke("WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)ke("WebGLRenderer: Texture marked for update but image is incomplete");else{Z(N,E,y);return}}else E.isExternalTexture&&(N.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,N.__webglTexture,i.TEXTURE0+y)}function V(E,y){let N=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&N.__version!==E.version){Z(N,E,y);return}else E.isExternalTexture&&(N.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,N.__webglTexture,i.TEXTURE0+y)}function W(E,y){let N=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&N.__version!==E.version){Z(N,E,y);return}t.bindTexture(i.TEXTURE_3D,N.__webglTexture,i.TEXTURE0+y)}function re(E,y){let N=n.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&N.__version!==E.version){ae(N,E,y);return}t.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+y)}let se={[os]:i.REPEAT,[Yt]:i.CLAMP_TO_EDGE,[$r]:i.MIRRORED_REPEAT},ge={[xt]:i.NEAREST,[bh]:i.NEAREST_MIPMAP_NEAREST,[Ks]:i.NEAREST_MIPMAP_LINEAR,[et]:i.LINEAR,[Sa]:i.LINEAR_MIPMAP_NEAREST,[Dn]:i.LINEAR_MIPMAP_LINEAR},ye={[Ah]:i.NEVER,[Ih]:i.ALWAYS,[Eh]:i.LESS,[lo]:i.LEQUAL,[Ch]:i.EQUAL,[co]:i.GEQUAL,[Rh]:i.GREATER,[Ph]:i.NOTEQUAL};function me(E,y){if(y.type===Vt&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===et||y.magFilter===Sa||y.magFilter===Ks||y.magFilter===Dn||y.minFilter===et||y.minFilter===Sa||y.minFilter===Ks||y.minFilter===Dn)&&ke("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,se[y.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,se[y.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,se[y.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,ge[y.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,ge[y.minFilter]),y.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,ye[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===xt||y.minFilter!==Ks&&y.minFilter!==Dn||y.type===Vt&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){let N=e.get("EXT_texture_filter_anisotropic");i.texParameterf(E,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Be(E,y){let N=!1;E.__webglInit===void 0&&(E.__webglInit=!0,y.addEventListener("dispose",w));let j=y.source,Q=u.get(j);Q===void 0&&(Q={},u.set(j,Q));let K=G(y);if(K!==E.__cacheKey){Q[K]===void 0&&(Q[K]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,N=!0),Q[K].usedTimes++;let we=Q[E.__cacheKey];we!==void 0&&(Q[E.__cacheKey].usedTimes--,we.usedTimes===0&&S(y)),E.__cacheKey=K,E.__webglTexture=Q[K].texture}return N}function st(E,y,N){return Math.floor(Math.floor(E/N)/y)}function rt(E,y,N,j){let K=E.updateRanges;if(K.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,N,j,y.data);else{K.sort((L,B)=>L.start-B.start);let we=0;for(let L=1;L<K.length;L++){let B=K[we],J=K[L],ie=B.start+B.count,ee=st(J.start,y.width,4),Re=st(B.start,y.width,4);J.start<=ie+1&&ee===Re&&st(J.start+J.count-1,y.width,4)===ee?B.count=Math.max(B.count,J.start+J.count-B.start):(++we,K[we]=J)}K.length=we+1;let de=i.getParameter(i.UNPACK_ROW_LENGTH),Le=i.getParameter(i.UNPACK_SKIP_PIXELS),Oe=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let L=0,B=K.length;L<B;L++){let J=K[L],ie=Math.floor(J.start/4),ee=Math.ceil(J.count/4),Re=ie%y.width,I=Math.floor(ie/y.width),te=ee,ne=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Re),i.pixelStorei(i.UNPACK_SKIP_ROWS,I),t.texSubImage2D(i.TEXTURE_2D,0,Re,I,te,ne,N,j,y.data)}E.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,de),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Le),i.pixelStorei(i.UNPACK_SKIP_ROWS,Oe)}}function Z(E,y,N){let j=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(j=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(j=i.TEXTURE_3D);let Q=Be(E,y),K=y.source;t.bindTexture(j,E.__webglTexture,i.TEXTURE0+N);let we=n.get(K);if(K.version!==we.__version||Q===!0){t.activeTexture(i.TEXTURE0+N);let de=nt.getPrimaries(nt.workingColorSpace),Le=y.colorSpace===$n?null:nt.getPrimaries(y.colorSpace),Oe=y.colorSpace===$n||de===Le?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Oe);let L=g(y.image,!1,s.maxTextureSize);L=je(y,L);let B=r.convert(y.format,y.colorSpace),J=r.convert(y.type),ie=M(y.internalFormat,B,J,y.colorSpace,y.isVideoTexture);me(j,y);let ee,Re=y.mipmaps,I=y.isVideoTexture!==!0,te=we.__version===void 0||Q===!0,ne=K.dataReady,Te=A(y,L);if(y.isDepthTexture)ie=b(y.format===pi,y.type),te&&(I?t.texStorage2D(i.TEXTURE_2D,1,ie,L.width,L.height):t.texImage2D(i.TEXTURE_2D,0,ie,L.width,L.height,0,B,J,null));else if(y.isDataTexture)if(Re.length>0){I&&te&&t.texStorage2D(i.TEXTURE_2D,Te,ie,Re[0].width,Re[0].height);for(let le=0,$=Re.length;le<$;le++)ee=Re[le],I?ne&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,ee.width,ee.height,B,J,ee.data):t.texImage2D(i.TEXTURE_2D,le,ie,ee.width,ee.height,0,B,J,ee.data);y.generateMipmaps=!1}else I?(te&&t.texStorage2D(i.TEXTURE_2D,Te,ie,L.width,L.height),ne&&rt(y,L,B,J)):t.texImage2D(i.TEXTURE_2D,0,ie,L.width,L.height,0,B,J,L.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){I&&te&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Te,ie,Re[0].width,Re[0].height,L.depth);for(let le=0,$=Re.length;le<$;le++)if(ee=Re[le],y.format!==Mt)if(B!==null)if(I){if(ne)if(y.layerUpdates.size>0){let Ae=Vl(ee.width,ee.height,y.format,y.type);for(let Ue of y.layerUpdates){let pt=ee.data.subarray(Ue*Ae/ee.data.BYTES_PER_ELEMENT,(Ue+1)*Ae/ee.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,Ue,ee.width,ee.height,1,B,pt)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,0,ee.width,ee.height,L.depth,B,ee.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,le,ie,ee.width,ee.height,L.depth,0,ee.data,0,0);else ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else I?ne&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,0,ee.width,ee.height,L.depth,B,J,ee.data):t.texImage3D(i.TEXTURE_2D_ARRAY,le,ie,ee.width,ee.height,L.depth,0,B,J,ee.data)}else{I&&te&&t.texStorage2D(i.TEXTURE_2D,Te,ie,Re[0].width,Re[0].height);for(let le=0,$=Re.length;le<$;le++)ee=Re[le],y.format!==Mt?B!==null?I?ne&&t.compressedTexSubImage2D(i.TEXTURE_2D,le,0,0,ee.width,ee.height,B,ee.data):t.compressedTexImage2D(i.TEXTURE_2D,le,ie,ee.width,ee.height,0,ee.data):ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?ne&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,ee.width,ee.height,B,J,ee.data):t.texImage2D(i.TEXTURE_2D,le,ie,ee.width,ee.height,0,B,J,ee.data)}else if(y.isDataArrayTexture)if(I){if(te&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Te,ie,L.width,L.height,L.depth),ne)if(y.layerUpdates.size>0){let le=Vl(L.width,L.height,y.format,y.type);for(let $ of y.layerUpdates){let Ae=L.data.subarray($*le/L.data.BYTES_PER_ELEMENT,($+1)*le/L.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,$,L.width,L.height,1,B,J,Ae)}y.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,L.width,L.height,L.depth,B,J,L.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ie,L.width,L.height,L.depth,0,B,J,L.data);else if(y.isData3DTexture)I?(te&&t.texStorage3D(i.TEXTURE_3D,Te,ie,L.width,L.height,L.depth),ne&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,L.width,L.height,L.depth,B,J,L.data)):t.texImage3D(i.TEXTURE_3D,0,ie,L.width,L.height,L.depth,0,B,J,L.data);else if(y.isFramebufferTexture){if(te)if(I)t.texStorage2D(i.TEXTURE_2D,Te,ie,L.width,L.height);else{let le=L.width,$=L.height;for(let Ae=0;Ae<Te;Ae++)t.texImage2D(i.TEXTURE_2D,Ae,ie,le,$,0,B,J,null),le>>=1,$>>=1}}else if(Re.length>0){if(I&&te){let le=Ee(Re[0]);t.texStorage2D(i.TEXTURE_2D,Te,ie,le.width,le.height)}for(let le=0,$=Re.length;le<$;le++)ee=Re[le],I?ne&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,B,J,ee):t.texImage2D(i.TEXTURE_2D,le,ie,B,J,ee);y.generateMipmaps=!1}else if(I){if(te){let le=Ee(L);t.texStorage2D(i.TEXTURE_2D,Te,ie,le.width,le.height)}ne&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,B,J,L)}else t.texImage2D(i.TEXTURE_2D,0,ie,B,J,L);f(y)&&d(j),we.__version=K.version,y.onUpdate&&y.onUpdate(y)}E.__version=y.version}function ae(E,y,N){if(y.image.length!==6)return;let j=Be(E,y),Q=y.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+N);let K=n.get(Q);if(Q.version!==K.__version||j===!0){t.activeTexture(i.TEXTURE0+N);let we=nt.getPrimaries(nt.workingColorSpace),de=y.colorSpace===$n?null:nt.getPrimaries(y.colorSpace),Le=y.colorSpace===$n||we===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Le);let Oe=y.isCompressedTexture||y.image[0].isCompressedTexture,L=y.image[0]&&y.image[0].isDataTexture,B=[];for(let $=0;$<6;$++)!Oe&&!L?B[$]=g(y.image[$],!0,s.maxCubemapSize):B[$]=L?y.image[$].image:y.image[$],B[$]=je(y,B[$]);let J=B[0],ie=r.convert(y.format,y.colorSpace),ee=r.convert(y.type),Re=M(y.internalFormat,ie,ee,y.colorSpace),I=y.isVideoTexture!==!0,te=K.__version===void 0||j===!0,ne=Q.dataReady,Te=A(y,J);me(i.TEXTURE_CUBE_MAP,y);let le;if(Oe){I&&te&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Te,Re,J.width,J.height);for(let $=0;$<6;$++){le=B[$].mipmaps;for(let Ae=0;Ae<le.length;Ae++){let Ue=le[Ae];y.format!==Mt?ie!==null?I?ne&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Ae,0,0,Ue.width,Ue.height,ie,Ue.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Ae,Re,Ue.width,Ue.height,0,Ue.data):ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Ae,0,0,Ue.width,Ue.height,ie,ee,Ue.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Ae,Re,Ue.width,Ue.height,0,ie,ee,Ue.data)}}}else{if(le=y.mipmaps,I&&te){le.length>0&&Te++;let $=Ee(B[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Te,Re,$.width,$.height)}for(let $=0;$<6;$++)if(L){I?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,B[$].width,B[$].height,ie,ee,B[$].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Re,B[$].width,B[$].height,0,ie,ee,B[$].data);for(let Ae=0;Ae<le.length;Ae++){let pt=le[Ae].image[$].image;I?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Ae+1,0,0,pt.width,pt.height,ie,ee,pt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Ae+1,Re,pt.width,pt.height,0,ie,ee,pt.data)}}else{I?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,ie,ee,B[$]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Re,ie,ee,B[$]);for(let Ae=0;Ae<le.length;Ae++){let Ue=le[Ae];I?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Ae+1,0,0,ie,ee,Ue.image[$]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Ae+1,Re,ie,ee,Ue.image[$])}}}f(y)&&d(i.TEXTURE_CUBE_MAP),K.__version=Q.version,y.onUpdate&&y.onUpdate(y)}E.__version=y.version}function fe(E,y,N,j,Q,K){let we=r.convert(N.format,N.colorSpace),de=r.convert(N.type),Le=M(N.internalFormat,we,de,N.colorSpace),Oe=n.get(y),L=n.get(N);if(L.__renderTarget=y,!Oe.__hasExternalTextures){let B=Math.max(1,y.width>>K),J=Math.max(1,y.height>>K);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?t.texImage3D(Q,K,Le,B,J,y.depth,0,we,de,null):t.texImage2D(Q,K,Le,B,J,0,we,de,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),it(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,Q,L.__webglTexture,0,P(y)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,j,Q,L.__webglTexture,K),t.bindFramebuffer(i.FRAMEBUFFER,null)}function k(E,y,N){if(i.bindRenderbuffer(i.RENDERBUFFER,E),y.depthBuffer){let j=y.depthTexture,Q=j&&j.isDepthTexture?j.type:null,K=b(y.stencilBuffer,Q),we=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;it(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,P(y),K,y.width,y.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,P(y),K,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,K,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,we,i.RENDERBUFFER,E)}else{let j=y.textures;for(let Q=0;Q<j.length;Q++){let K=j[Q],we=r.convert(K.format,K.colorSpace),de=r.convert(K.type),Le=M(K.internalFormat,we,de,K.colorSpace);it(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,P(y),Le,y.width,y.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,P(y),Le,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Le,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function oe(E,y,N){let j=y.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Q=n.get(y.depthTexture);if(Q.__renderTarget=y,(!Q.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),j){if(Q.__webglInit===void 0&&(Q.__webglInit=!0,y.depthTexture.addEventListener("dispose",w)),Q.__webglTexture===void 0){Q.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),me(i.TEXTURE_CUBE_MAP,y.depthTexture);let Oe=r.convert(y.depthTexture.format),L=r.convert(y.depthTexture.type),B;y.depthTexture.format===An?B=i.DEPTH_COMPONENT24:y.depthTexture.format===pi&&(B=i.DEPTH24_STENCIL8);for(let J=0;J<6;J++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,B,y.width,y.height,0,Oe,L,null)}}else H(y.depthTexture,0);let K=Q.__webglTexture,we=P(y),de=j?i.TEXTURE_CUBE_MAP_POSITIVE_X+N:i.TEXTURE_2D,Le=y.depthTexture.format===pi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(y.depthTexture.format===An)it(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Le,de,K,0,we):i.framebufferTexture2D(i.FRAMEBUFFER,Le,de,K,0);else if(y.depthTexture.format===pi)it(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Le,de,K,0,we):i.framebufferTexture2D(i.FRAMEBUFFER,Le,de,K,0);else throw new Error("Unknown depthTexture format")}function ue(E){let y=n.get(E),N=E.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==E.depthTexture){let j=E.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),j){let Q=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,j.removeEventListener("dispose",Q)};j.addEventListener("dispose",Q),y.__depthDisposeCallback=Q}y.__boundDepthTexture=j}if(E.depthTexture&&!y.__autoAllocateDepthBuffer)if(N)for(let j=0;j<6;j++)oe(y.__webglFramebuffer[j],E,j);else{let j=E.texture.mipmaps;j&&j.length>0?oe(y.__webglFramebuffer[0],E,0):oe(y.__webglFramebuffer,E,0)}else if(N){y.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[j]),y.__webglDepthbuffer[j]===void 0)y.__webglDepthbuffer[j]=i.createRenderbuffer(),k(y.__webglDepthbuffer[j],E,!1);else{let Q=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=y.__webglDepthbuffer[j];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,K)}}else{let j=E.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),k(y.__webglDepthbuffer,E,!1);else{let Q=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,K)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Me(E,y,N){let j=n.get(E);y!==void 0&&fe(j.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),N!==void 0&&ue(E)}function he(E){let y=E.texture,N=n.get(E),j=n.get(y);E.addEventListener("dispose",C);let Q=E.textures,K=E.isWebGLCubeRenderTarget===!0,we=Q.length>1;if(we||(j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture()),j.__version=y.version,a.memory.textures++),K){N.__webglFramebuffer=[];for(let de=0;de<6;de++)if(y.mipmaps&&y.mipmaps.length>0){N.__webglFramebuffer[de]=[];for(let Le=0;Le<y.mipmaps.length;Le++)N.__webglFramebuffer[de][Le]=i.createFramebuffer()}else N.__webglFramebuffer[de]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){N.__webglFramebuffer=[];for(let de=0;de<y.mipmaps.length;de++)N.__webglFramebuffer[de]=i.createFramebuffer()}else N.__webglFramebuffer=i.createFramebuffer();if(we)for(let de=0,Le=Q.length;de<Le;de++){let Oe=n.get(Q[de]);Oe.__webglTexture===void 0&&(Oe.__webglTexture=i.createTexture(),a.memory.textures++)}if(E.samples>0&&it(E)===!1){N.__webglMultisampledFramebuffer=i.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let de=0;de<Q.length;de++){let Le=Q[de];N.__webglColorRenderbuffer[de]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,N.__webglColorRenderbuffer[de]);let Oe=r.convert(Le.format,Le.colorSpace),L=r.convert(Le.type),B=M(Le.internalFormat,Oe,L,Le.colorSpace,E.isXRRenderTarget===!0),J=P(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,J,B,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.RENDERBUFFER,N.__webglColorRenderbuffer[de])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(N.__webglDepthRenderbuffer=i.createRenderbuffer(),k(N.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){t.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture),me(i.TEXTURE_CUBE_MAP,y);for(let de=0;de<6;de++)if(y.mipmaps&&y.mipmaps.length>0)for(let Le=0;Le<y.mipmaps.length;Le++)fe(N.__webglFramebuffer[de][Le],E,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,Le);else fe(N.__webglFramebuffer[de],E,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);f(y)&&d(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let de=0,Le=Q.length;de<Le;de++){let Oe=Q[de],L=n.get(Oe),B=i.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(B=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(B,L.__webglTexture),me(B,Oe),fe(N.__webglFramebuffer,E,Oe,i.COLOR_ATTACHMENT0+de,B,0),f(Oe)&&d(B)}t.unbindTexture()}else{let de=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(de=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(de,j.__webglTexture),me(de,y),y.mipmaps&&y.mipmaps.length>0)for(let Le=0;Le<y.mipmaps.length;Le++)fe(N.__webglFramebuffer[Le],E,y,i.COLOR_ATTACHMENT0,de,Le);else fe(N.__webglFramebuffer,E,y,i.COLOR_ATTACHMENT0,de,0);f(y)&&d(de),t.unbindTexture()}E.depthBuffer&&ue(E)}function Se(E){let y=E.textures;for(let N=0,j=y.length;N<j;N++){let Q=y[N];if(f(Q)){let K=x(E),we=n.get(Q).__webglTexture;t.bindTexture(K,we),d(K),t.unbindTexture()}}}let be=[],pe=[];function De(E){if(E.samples>0){if(it(E)===!1){let y=E.textures,N=E.width,j=E.height,Q=i.COLOR_BUFFER_BIT,K=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,we=n.get(E),de=y.length>1;if(de)for(let Oe=0;Oe<y.length;Oe++)t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Oe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Oe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer);let Le=E.texture.mipmaps;Le&&Le.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let Oe=0;Oe<y.length;Oe++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),de){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,we.__webglColorRenderbuffer[Oe]);let L=n.get(y[Oe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,L,0)}i.blitFramebuffer(0,0,N,j,0,0,N,j,Q,i.NEAREST),l===!0&&(be.length=0,pe.length=0,be.push(i.COLOR_ATTACHMENT0+Oe),E.depthBuffer&&E.resolveDepthBuffer===!1&&(be.push(K),pe.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,pe)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,be))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),de)for(let Oe=0;Oe<y.length;Oe++){t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Oe,i.RENDERBUFFER,we.__webglColorRenderbuffer[Oe]);let L=n.get(y[Oe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Oe,i.TEXTURE_2D,L,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){let y=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function P(E){return Math.min(s.maxSamples,E.samples)}function it(E){let y=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function Ve(E){let y=a.render.frame;h.get(E)!==y&&(h.set(E,y),E.update())}function je(E,y){let N=E.colorSpace,j=E.format,Q=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||N!==qn&&N!==$n&&(nt.getTransfer(N)===ct?(j!==Mt||Q!==Ut)&&ke("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ze("WebGLTextures: Unsupported texture color space:",N)),y}function Ee(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=F,this.setTexture2D=H,this.setTexture2DArray=V,this.setTexture3D=W,this.setTextureCube=re,this.rebindTextures=Me,this.setupRenderTarget=he,this.updateRenderTargetMipmap=Se,this.updateMultisampleRenderTarget=De,this.setupDepthRenderbuffer=ue,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=it,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Og(i,e){function t(n,s=$n){let r,a=nt.getTransfer(s);if(n===Ut)return i.UNSIGNED_BYTE;if(n===Ta)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Aa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ll)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Fl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Il)return i.BYTE;if(n===Dl)return i.SHORT;if(n===ds)return i.UNSIGNED_SHORT;if(n===wa)return i.INT;if(n===yn)return i.UNSIGNED_INT;if(n===Vt)return i.FLOAT;if(n===Pt)return i.HALF_FLOAT;if(n===Nl)return i.ALPHA;if(n===Ul)return i.RGB;if(n===Mt)return i.RGBA;if(n===An)return i.DEPTH_COMPONENT;if(n===pi)return i.DEPTH_STENCIL;if(n===Ii)return i.RED;if(n===Ea)return i.RED_INTEGER;if(n===Kn)return i.RG;if(n===Ca)return i.RG_INTEGER;if(n===Ra)return i.RGBA_INTEGER;if(n===$s||n===Js||n===js||n===Qs)if(a===ct)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===$s)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Qs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===$s)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Js)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===js)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Qs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Pa||n===Ia||n===Da||n===La)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Pa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ia)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Da)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===La)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Fa||n===Na||n===Ua||n===Oa||n===Ba||n===za||n===ka)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Fa||n===Na)return a===ct?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ua)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Oa)return r.COMPRESSED_R11_EAC;if(n===Ba)return r.COMPRESSED_SIGNED_R11_EAC;if(n===za)return r.COMPRESSED_RG11_EAC;if(n===ka)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ga||n===Va||n===Ha||n===Wa||n===Xa||n===qa||n===Ya||n===Za||n===Ka||n===$a||n===Ja||n===ja||n===Qa||n===eo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ga)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Va)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ha)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wa)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Xa)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===qa)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ya)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Za)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ka)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===$a)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ja)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ja)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Qa)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===eo)return a===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===to||n===no||n===io)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===to)return a===ct?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===no)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===io)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===so||n===ro||n===ao||n===oo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===so)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ro)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ao)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===oo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ps?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Bg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,nc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Gs(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ge({vertexShader:Bg,fragmentShader:zg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new We(new Ri(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ic=class extends Yn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,p=null,u=null,m=null,v=null,g=typeof XRWebGLBinding<"u",f=new nc,d={},x=t.getContextAttributes(),M=null,b=null,A=[],w=[],C=new Xe,_=null,S=new qt;S.viewport=new Je;let U=new qt;U.viewport=new Je;let R=[S,U],F=new _a,O=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ae=A[Z];return ae===void 0&&(ae=new hs,A[Z]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(Z){let ae=A[Z];return ae===void 0&&(ae=new hs,A[Z]=ae),ae.getGripSpace()},this.getHand=function(Z){let ae=A[Z];return ae===void 0&&(ae=new hs,A[Z]=ae),ae.getHandSpace()};function H(Z){let ae=w.indexOf(Z.inputSource);if(ae===-1)return;let fe=A[ae];fe!==void 0&&(fe.update(Z.inputSource,Z.frame,c||a),fe.dispatchEvent({type:Z.type,data:Z.inputSource}))}function V(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",W);for(let Z=0;Z<A.length;Z++){let ae=w[Z];ae!==null&&(w[Z]=null,A[Z].disconnect(ae))}O=null,G=null,f.reset();for(let Z in d)delete d[Z];e.setRenderTarget(M),m=null,u=null,p=null,s=null,b=null,rt.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&ke("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&ke("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return p===null&&g&&(p=new XRWebGLBinding(s,t)),p},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",V),s.addEventListener("inputsourceschange",W),x.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(C),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let fe=null,k=null,oe=null;x.depth&&(oe=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=x.stencil?pi:An,k=x.stencil?ps:yn);let ue={colorFormat:t.RGBA8,depthFormat:oe,scaleFactor:r};p=this.getBinding(),u=p.createProjectionLayer(ue),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),b=new yt(u.textureWidth,u.textureHeight,{format:Mt,type:Ut,depthTexture:new Pn(u.textureWidth,u.textureHeight,k,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{let fe={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,fe),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),b=new yt(m.framebufferWidth,m.framebufferHeight,{format:Mt,type:Ut,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),rt.setContext(s),rt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function W(Z){for(let ae=0;ae<Z.removed.length;ae++){let fe=Z.removed[ae],k=w.indexOf(fe);k>=0&&(w[k]=null,A[k].disconnect(fe))}for(let ae=0;ae<Z.added.length;ae++){let fe=Z.added[ae],k=w.indexOf(fe);if(k===-1){for(let ue=0;ue<A.length;ue++)if(ue>=w.length){w.push(fe),k=ue;break}else if(w[ue]===null){w[ue]=fe,k=ue;break}if(k===-1)break}let oe=A[k];oe&&oe.connect(fe)}}let re=new D,se=new D;function ge(Z,ae,fe){re.setFromMatrixPosition(ae.matrixWorld),se.setFromMatrixPosition(fe.matrixWorld);let k=re.distanceTo(se),oe=ae.projectionMatrix.elements,ue=fe.projectionMatrix.elements,Me=oe[14]/(oe[10]-1),he=oe[14]/(oe[10]+1),Se=(oe[9]+1)/oe[5],be=(oe[9]-1)/oe[5],pe=(oe[8]-1)/oe[0],De=(ue[8]+1)/ue[0],P=Me*pe,it=Me*De,Ve=k/(-pe+De),je=Ve*-pe;if(ae.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(je),Z.translateZ(Ve),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),oe[10]===-1)Z.projectionMatrix.copy(ae.projectionMatrix),Z.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{let Ee=Me+Ve,E=he+Ve,y=P-je,N=it+(k-je),j=Se*he/E*Ee,Q=be*he/E*Ee;Z.projectionMatrix.makePerspective(y,N,j,Q,Ee,E),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ye(Z,ae){ae===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ae.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let ae=Z.near,fe=Z.far;f.texture!==null&&(f.depthNear>0&&(ae=f.depthNear),f.depthFar>0&&(fe=f.depthFar)),F.near=U.near=S.near=ae,F.far=U.far=S.far=fe,(O!==F.near||G!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),O=F.near,G=F.far),F.layers.mask=Z.layers.mask|6,S.layers.mask=F.layers.mask&-5,U.layers.mask=F.layers.mask&-3;let k=Z.parent,oe=F.cameras;ye(F,k);for(let ue=0;ue<oe.length;ue++)ye(oe[ue],k);oe.length===2?ge(F,S,U):F.projectionMatrix.copy(S.projectionMatrix),me(Z,F,k)};function me(Z,ae,fe){fe===null?Z.matrix.copy(ae.matrixWorld):(Z.matrix.copy(fe.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ae.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ae.projectionMatrix),Z.projectionMatrixInverse.copy(ae.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=jr*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(u===null&&m===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Z)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(F)},this.getCameraTexture=function(Z){return d[Z]};let Be=null;function st(Z,ae){if(h=ae.getViewerPose(c||a),v=ae,h!==null){let fe=h.views;m!==null&&(e.setRenderTargetFramebuffer(b,m.framebuffer),e.setRenderTarget(b));let k=!1;fe.length!==F.cameras.length&&(F.cameras.length=0,k=!0);for(let he=0;he<fe.length;he++){let Se=fe[he],be=null;if(m!==null)be=m.getViewport(Se);else{let De=p.getViewSubImage(u,Se);be=De.viewport,he===0&&(e.setRenderTargetTextures(b,De.colorTexture,De.depthStencilTexture),e.setRenderTarget(b))}let pe=R[he];pe===void 0&&(pe=new qt,pe.layers.enable(he),pe.viewport=new Je,R[he]=pe),pe.matrix.fromArray(Se.transform.matrix),pe.matrix.decompose(pe.position,pe.quaternion,pe.scale),pe.projectionMatrix.fromArray(Se.projectionMatrix),pe.projectionMatrixInverse.copy(pe.projectionMatrix).invert(),pe.viewport.set(be.x,be.y,be.width,be.height),he===0&&(F.matrix.copy(pe.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),k===!0&&F.cameras.push(pe)}let oe=s.enabledFeatures;if(oe&&oe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&g){p=n.getBinding();let he=p.getDepthInformation(fe[0]);he&&he.isValid&&he.texture&&f.init(he,s.renderState)}if(oe&&oe.includes("camera-access")&&g){e.state.unbindTexture(),p=n.getBinding();for(let he=0;he<fe.length;he++){let Se=fe[he].camera;if(Se){let be=d[Se];be||(be=new Gs,d[Se]=be);let pe=p.getCameraImage(Se);be.sourceTexture=pe}}}}for(let fe=0;fe<A.length;fe++){let k=w[fe],oe=A[fe];k!==null&&oe!==void 0&&oe.update(k,ae,c||a)}Be&&Be(Z,ae),ae.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ae}),v=null}let rt=new ou;rt.setAnimationLoop(st),this.setAnimationLoop=function(Z){Be=Z},this.dispose=function(){}}},Fi=new Cn,kg=new ht;function Gg(i,e){function t(f,d){f.matrixAutoUpdate===!0&&f.updateMatrix(),d.value.copy(f.matrix)}function n(f,d){d.color.getRGB(f.fogColor.value,zl(i)),d.isFog?(f.fogNear.value=d.near,f.fogFar.value=d.far):d.isFogExp2&&(f.fogDensity.value=d.density)}function s(f,d,x,M,b){d.isMeshBasicMaterial?r(f,d):d.isMeshLambertMaterial?(r(f,d),d.envMap&&(f.envMapIntensity.value=d.envMapIntensity)):d.isMeshToonMaterial?(r(f,d),p(f,d)):d.isMeshPhongMaterial?(r(f,d),h(f,d),d.envMap&&(f.envMapIntensity.value=d.envMapIntensity)):d.isMeshStandardMaterial?(r(f,d),u(f,d),d.isMeshPhysicalMaterial&&m(f,d,b)):d.isMeshMatcapMaterial?(r(f,d),v(f,d)):d.isMeshDepthMaterial?r(f,d):d.isMeshDistanceMaterial?(r(f,d),g(f,d)):d.isMeshNormalMaterial?r(f,d):d.isLineBasicMaterial?(a(f,d),d.isLineDashedMaterial&&o(f,d)):d.isPointsMaterial?l(f,d,x,M):d.isSpriteMaterial?c(f,d):d.isShadowMaterial?(f.color.value.copy(d.color),f.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(f,d){f.opacity.value=d.opacity,d.color&&f.diffuse.value.copy(d.color),d.emissive&&f.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(f.map.value=d.map,t(d.map,f.mapTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,t(d.alphaMap,f.alphaMapTransform)),d.bumpMap&&(f.bumpMap.value=d.bumpMap,t(d.bumpMap,f.bumpMapTransform),f.bumpScale.value=d.bumpScale,d.side===Jt&&(f.bumpScale.value*=-1)),d.normalMap&&(f.normalMap.value=d.normalMap,t(d.normalMap,f.normalMapTransform),f.normalScale.value.copy(d.normalScale),d.side===Jt&&f.normalScale.value.negate()),d.displacementMap&&(f.displacementMap.value=d.displacementMap,t(d.displacementMap,f.displacementMapTransform),f.displacementScale.value=d.displacementScale,f.displacementBias.value=d.displacementBias),d.emissiveMap&&(f.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,f.emissiveMapTransform)),d.specularMap&&(f.specularMap.value=d.specularMap,t(d.specularMap,f.specularMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest);let x=e.get(d),M=x.envMap,b=x.envMapRotation;M&&(f.envMap.value=M,Fi.copy(b),Fi.x*=-1,Fi.y*=-1,Fi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Fi.y*=-1,Fi.z*=-1),f.envMapRotation.value.setFromMatrix4(kg.makeRotationFromEuler(Fi)),f.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=d.reflectivity,f.ior.value=d.ior,f.refractionRatio.value=d.refractionRatio),d.lightMap&&(f.lightMap.value=d.lightMap,f.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,f.lightMapTransform)),d.aoMap&&(f.aoMap.value=d.aoMap,f.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,f.aoMapTransform))}function a(f,d){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,d.map&&(f.map.value=d.map,t(d.map,f.mapTransform))}function o(f,d){f.dashSize.value=d.dashSize,f.totalSize.value=d.dashSize+d.gapSize,f.scale.value=d.scale}function l(f,d,x,M){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,f.size.value=d.size*x,f.scale.value=M*.5,d.map&&(f.map.value=d.map,t(d.map,f.uvTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,t(d.alphaMap,f.alphaMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest)}function c(f,d){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,f.rotation.value=d.rotation,d.map&&(f.map.value=d.map,t(d.map,f.mapTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,t(d.alphaMap,f.alphaMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest)}function h(f,d){f.specular.value.copy(d.specular),f.shininess.value=Math.max(d.shininess,1e-4)}function p(f,d){d.gradientMap&&(f.gradientMap.value=d.gradientMap)}function u(f,d){f.metalness.value=d.metalness,d.metalnessMap&&(f.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,f.metalnessMapTransform)),f.roughness.value=d.roughness,d.roughnessMap&&(f.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,f.roughnessMapTransform)),d.envMap&&(f.envMapIntensity.value=d.envMapIntensity)}function m(f,d,x){f.ior.value=d.ior,d.sheen>0&&(f.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),f.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(f.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,f.sheenColorMapTransform)),d.sheenRoughnessMap&&(f.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,f.sheenRoughnessMapTransform))),d.clearcoat>0&&(f.clearcoat.value=d.clearcoat,f.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(f.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,f.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(f.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Jt&&f.clearcoatNormalScale.value.negate())),d.dispersion>0&&(f.dispersion.value=d.dispersion),d.iridescence>0&&(f.iridescence.value=d.iridescence,f.iridescenceIOR.value=d.iridescenceIOR,f.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(f.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,f.iridescenceMapTransform)),d.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),d.transmission>0&&(f.transmission.value=d.transmission,f.transmissionSamplerMap.value=x.texture,f.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(f.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,f.transmissionMapTransform)),f.thickness.value=d.thickness,d.thicknessMap&&(f.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=d.attenuationDistance,f.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(f.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(f.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=d.specularIntensity,f.specularColor.value.copy(d.specularColor),d.specularColorMap&&(f.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,f.specularColorMapTransform)),d.specularIntensityMap&&(f.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,f.specularIntensityMapTransform))}function v(f,d){d.matcap&&(f.matcap.value=d.matcap)}function g(f,d){let x=e.get(d).light;f.referencePosition.value.setFromMatrixPosition(x.matrixWorld),f.nearDistance.value=x.shadow.camera.near,f.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Vg(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,M){let b=M.program;n.uniformBlockBinding(x,b)}function c(x,M){let b=s[x.id];b===void 0&&(v(x),b=h(x),s[x.id]=b,x.addEventListener("dispose",f));let A=M.program;n.updateUBOMapping(x,A);let w=e.render.frame;r[x.id]!==w&&(u(x),r[x.id]=w)}function h(x){let M=p();x.__bindingPointIndex=M;let b=i.createBuffer(),A=x.__size,w=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,A,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,b),b}function p(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return ze("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){let M=s[x.id],b=x.uniforms,A=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let w=0,C=b.length;w<C;w++){let _=Array.isArray(b[w])?b[w]:[b[w]];for(let S=0,U=_.length;S<U;S++){let R=_[S];if(m(R,w,S,A)===!0){let F=R.__offset,O=Array.isArray(R.value)?R.value:[R.value],G=0;for(let H=0;H<O.length;H++){let V=O[H],W=g(V);typeof V=="number"||typeof V=="boolean"?(R.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,F+G,R.__data)):V.isMatrix3?(R.__data[0]=V.elements[0],R.__data[1]=V.elements[1],R.__data[2]=V.elements[2],R.__data[3]=0,R.__data[4]=V.elements[3],R.__data[5]=V.elements[4],R.__data[6]=V.elements[5],R.__data[7]=0,R.__data[8]=V.elements[6],R.__data[9]=V.elements[7],R.__data[10]=V.elements[8],R.__data[11]=0):(V.toArray(R.__data,G),G+=W.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(x,M,b,A){let w=x.value,C=M+"_"+b;if(A[C]===void 0)return typeof w=="number"||typeof w=="boolean"?A[C]=w:A[C]=w.clone(),!0;{let _=A[C];if(typeof w=="number"||typeof w=="boolean"){if(_!==w)return A[C]=w,!0}else if(_.equals(w)===!1)return _.copy(w),!0}return!1}function v(x){let M=x.uniforms,b=0,A=16;for(let C=0,_=M.length;C<_;C++){let S=Array.isArray(M[C])?M[C]:[M[C]];for(let U=0,R=S.length;U<R;U++){let F=S[U],O=Array.isArray(F.value)?F.value:[F.value];for(let G=0,H=O.length;G<H;G++){let V=O[G],W=g(V),re=b%A,se=re%W.boundary,ge=re+se;b+=se,ge!==0&&A-ge<W.storage&&(b+=A-ge),F.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=b,b+=W.storage}}}let w=b%A;return w>0&&(b+=A-w),x.__size=b,x.__cache={},this}function g(x){let M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=48,M.storage=48):x.isMatrix4?(M.boundary=64,M.storage=64):x.isTexture?ke("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ke("WebGLRenderer: Unsupported uniform value type.",x),M}function f(x){let M=x.target;M.removeEventListener("dispose",f);let b=a.indexOf(M.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function d(){for(let x in s)i.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}var Hg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ln=null;function Wg(){return Ln===null&&(Ln=new Rn(Hg,16,16,Kn,Pt),Ln.name="DFG_LUT",Ln.minFilter=et,Ln.magFilter=et,Ln.wrapS=Yt,Ln.wrapT=Yt,Ln.generateMipmaps=!1,Ln.needsUpdate=!0),Ln}var mo=class{constructor(e={}){let{canvas:t=Dh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:u=!1,outputBufferType:m=Ut}=e;this.isWebGLRenderer=!0;let v;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");v=n.getContextAttributes().alpha}else v=a;let g=m,f=new Set([Ra,Ca,Ea]),d=new Set([Ut,yn,ds,ps,Ta,Aa]),x=new Uint32Array(4),M=new Int32Array(4),b=null,A=null,w=[],C=[],_=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=un,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let S=this,U=!1;this._outputColorSpace=an;let R=0,F=0,O=null,G=-1,H=null,V=new Je,W=new Je,re=null,se=new ot(0),ge=0,ye=t.width,me=t.height,Be=1,st=null,rt=null,Z=new Je(0,0,ye,me),ae=new Je(0,0,ye,me),fe=!1,k=new zs,oe=!1,ue=!1,Me=new ht,he=new D,Se=new Je,be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},pe=!1;function De(){return O===null?Be:1}let P=n;function it(T,z){return t.getContext(T,z)}try{let T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:p};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"183"}`),t.addEventListener("webglcontextlost",Ae,!1),t.addEventListener("webglcontextrestored",Ue,!1),t.addEventListener("webglcontextcreationerror",pt,!1),P===null){let z="webgl2";if(P=it(z,T),P===null)throw it(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw ze("WebGLRenderer: "+T.message),T}let Ve,je,Ee,E,y,N,j,Q,K,we,de,Le,Oe,L,B,J,ie,ee,Re,I,te,ne,Te;function le(){Ve=new j0(P),Ve.init(),te=new Og(P,Ve),je=new W0(P,Ve,e,te),Ee=new Ng(P,Ve),je.reversedDepthBuffer&&u&&Ee.buffers.depth.setReversed(!0),E=new tm(P),y=new Mg,N=new Ug(P,Ve,Ee,y,je,te,E),j=new J0(S),Q=new ad(P),ne=new V0(P,Q),K=new Q0(P,Q,E,ne),we=new im(P,K,Q,ne,E),ee=new nm(P,je,N),B=new X0(y),de=new yg(S,j,Ve,je,ne,B),Le=new Gg(S,y),Oe=new Sg,L=new Rg(Ve),ie=new G0(S,j,Ee,we,v,l),J=new Fg(S,we,je),Te=new Vg(P,E,je,Ee),Re=new H0(P,Ve,E),I=new em(P,Ve,E),E.programs=de.programs,S.capabilities=je,S.extensions=Ve,S.properties=y,S.renderLists=Oe,S.shadowMap=J,S.state=Ee,S.info=E}le(),g!==Ut&&(_=new rm(g,t.width,t.height,s,r));let $=new ic(S,P);this.xr=$,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let T=Ve.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=Ve.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Be},this.setPixelRatio=function(T){T!==void 0&&(Be=T,this.setSize(ye,me,!1))},this.getSize=function(T){return T.set(ye,me)},this.setSize=function(T,z,Y=!0){if($.isPresenting){ke("WebGLRenderer: Can't change size while VR device is presenting.");return}ye=T,me=z,t.width=Math.floor(T*Be),t.height=Math.floor(z*Be),Y===!0&&(t.style.width=T+"px",t.style.height=z+"px"),_!==null&&_.setSize(t.width,t.height),this.setViewport(0,0,T,z)},this.getDrawingBufferSize=function(T){return T.set(ye*Be,me*Be).floor()},this.setDrawingBufferSize=function(T,z,Y){ye=T,me=z,Be=Y,t.width=Math.floor(T*Y),t.height=Math.floor(z*Y),this.setViewport(0,0,T,z)},this.setEffects=function(T){if(g===Ut){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let z=0;z<T.length;z++)if(T[z].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}_.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(V)},this.getViewport=function(T){return T.copy(Z)},this.setViewport=function(T,z,Y,q){T.isVector4?Z.set(T.x,T.y,T.z,T.w):Z.set(T,z,Y,q),Ee.viewport(V.copy(Z).multiplyScalar(Be).round())},this.getScissor=function(T){return T.copy(ae)},this.setScissor=function(T,z,Y,q){T.isVector4?ae.set(T.x,T.y,T.z,T.w):ae.set(T,z,Y,q),Ee.scissor(W.copy(ae).multiplyScalar(Be).round())},this.getScissorTest=function(){return fe},this.setScissorTest=function(T){Ee.setScissorTest(fe=T)},this.setOpaqueSort=function(T){st=T},this.setTransparentSort=function(T){rt=T},this.getClearColor=function(T){return T.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor(...arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha(...arguments)},this.clear=function(T=!0,z=!0,Y=!0){let q=0;if(T){let X=!1;if(O!==null){let xe=O.texture.format;X=f.has(xe)}if(X){let xe=O.texture.type,Ce=d.has(xe),_e=ie.getClearColor(),Pe=ie.getClearAlpha(),Fe=_e.r,Ze=_e.g,$e=_e.b;Ce?(x[0]=Fe,x[1]=Ze,x[2]=$e,x[3]=Pe,P.clearBufferuiv(P.COLOR,0,x)):(M[0]=Fe,M[1]=Ze,M[2]=$e,M[3]=Pe,P.clearBufferiv(P.COLOR,0,M))}else q|=P.COLOR_BUFFER_BIT}z&&(q|=P.DEPTH_BUFFER_BIT),Y&&(q|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),q!==0&&P.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ae,!1),t.removeEventListener("webglcontextrestored",Ue,!1),t.removeEventListener("webglcontextcreationerror",pt,!1),ie.dispose(),Oe.dispose(),L.dispose(),y.dispose(),j.dispose(),we.dispose(),ne.dispose(),Te.dispose(),de.dispose(),$.dispose(),$.removeEventListener("sessionstart",Cc),$.removeEventListener("sessionend",Rc),xi.stop()};function Ae(T){T.preventDefault(),Bl("WebGLRenderer: Context Lost."),U=!0}function Ue(){Bl("WebGLRenderer: Context Restored."),U=!1;let T=E.autoReset,z=J.enabled,Y=J.autoUpdate,q=J.needsUpdate,X=J.type;le(),E.autoReset=T,J.enabled=z,J.autoUpdate=Y,J.needsUpdate=q,J.type=X}function pt(T){ze("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function tt(T){let z=T.target;z.removeEventListener("dispose",tt),Un(z)}function Un(T){On(T),y.remove(T)}function On(T){let z=y.get(T).programs;z!==void 0&&(z.forEach(function(Y){de.releaseProgram(Y)}),T.isShaderMaterial&&de.releaseShaderCache(T))}this.renderBufferDirect=function(T,z,Y,q,X,xe){z===null&&(z=be);let Ce=X.isMesh&&X.matrixWorld.determinant()<0,_e=vf(T,z,Y,q,X);Ee.setMaterial(q,Ce);let Pe=Y.index,Fe=1;if(q.wireframe===!0){if(Pe=K.getWireframeAttribute(Y),Pe===void 0)return;Fe=2}let Ze=Y.drawRange,$e=Y.attributes.position,Ne=Ze.start*Fe,mt=(Ze.start+Ze.count)*Fe;xe!==null&&(Ne=Math.max(Ne,xe.start*Fe),mt=Math.min(mt,(xe.start+xe.count)*Fe)),Pe!==null?(Ne=Math.max(Ne,0),mt=Math.min(mt,Pe.count)):$e!=null&&(Ne=Math.max(Ne,0),mt=Math.min(mt,$e.count));let Tt=mt-Ne;if(Tt<0||Tt===1/0)return;ne.setup(X,q,_e,Y,Pe);let wt,gt=Re;if(Pe!==null&&(wt=Q.get(Pe),gt=I,gt.setIndex(wt)),X.isMesh)q.wireframe===!0?(Ee.setLineWidth(q.wireframeLinewidth*De()),gt.setMode(P.LINES)):gt.setMode(P.TRIANGLES);else if(X.isLine){let Ht=q.linewidth;Ht===void 0&&(Ht=1),Ee.setLineWidth(Ht*De()),X.isLineSegments?gt.setMode(P.LINES):X.isLineLoop?gt.setMode(P.LINE_LOOP):gt.setMode(P.LINE_STRIP)}else X.isPoints?gt.setMode(P.POINTS):X.isSprite&&gt.setMode(P.TRIANGLES);if(X.isBatchedMesh)if(X._multiDrawInstances!==null)Ds("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),gt.renderMultiDrawInstances(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount,X._multiDrawInstances);else if(Ve.get("WEBGL_multi_draw"))gt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{let Ht=X._multiDrawStarts,Ie=X._multiDrawCounts,nn=X._multiDrawCount,at=Pe?Q.get(Pe).bytesPerElement:1,mn=y.get(q).currentProgram.getUniforms();for(let bn=0;bn<nn;bn++)mn.setValue(P,"_gl_DrawID",bn),gt.render(Ht[bn]/at,Ie[bn])}else if(X.isInstancedMesh)gt.renderInstances(Ne,Tt,X.count);else if(Y.isInstancedBufferGeometry){let Ht=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Ie=Math.min(Y.instanceCount,Ht);gt.renderInstances(Ne,Tt,Ie)}else gt.render(Ne,Tt)};function Ec(T,z,Y){T.transparent===!0&&T.side===In&&T.forceSinglePass===!1?(T.side=Jt,T.needsUpdate=!0,vr(T,z,Y),T.side=Xn,T.needsUpdate=!0,vr(T,z,Y),T.side=In):vr(T,z,Y)}this.compile=function(T,z,Y=null){Y===null&&(Y=T),A=L.get(Y),A.init(z),C.push(A),Y.traverseVisible(function(X){X.isLight&&X.layers.test(z.layers)&&(A.pushLight(X),X.castShadow&&A.pushShadow(X))}),T!==Y&&T.traverseVisible(function(X){X.isLight&&X.layers.test(z.layers)&&(A.pushLight(X),X.castShadow&&A.pushShadow(X))}),A.setupLights();let q=new Set;return T.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;let xe=X.material;if(xe)if(Array.isArray(xe))for(let Ce=0;Ce<xe.length;Ce++){let _e=xe[Ce];Ec(_e,Y,X),q.add(_e)}else Ec(xe,Y,X),q.add(xe)}),A=C.pop(),q},this.compileAsync=function(T,z,Y=null){let q=this.compile(T,z,Y);return new Promise(X=>{function xe(){if(q.forEach(function(Ce){y.get(Ce).currentProgram.isReady()&&q.delete(Ce)}),q.size===0){X(T);return}setTimeout(xe,10)}Ve.get("KHR_parallel_shader_compile")!==null?xe():setTimeout(xe,10)})};let ko=null;function gf(T){ko&&ko(T)}function Cc(){xi.stop()}function Rc(){xi.start()}let xi=new ou;xi.setAnimationLoop(gf),typeof self<"u"&&xi.setContext(self),this.setAnimationLoop=function(T){ko=T,$.setAnimationLoop(T),T===null?xi.stop():xi.start()},$.addEventListener("sessionstart",Cc),$.addEventListener("sessionend",Rc),this.render=function(T,z){if(z!==void 0&&z.isCamera!==!0){ze("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;let Y=$.enabled===!0&&$.isPresenting===!0,q=_!==null&&(O===null||Y)&&_.begin(S,O);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&(_===null||_.isCompositing()===!1)&&($.cameraAutoUpdate===!0&&$.updateCamera(z),z=$.getCamera()),T.isScene===!0&&T.onBeforeRender(S,T,z,O),A=L.get(T,C.length),A.init(z),C.push(A),Me.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),k.setFromProjectionMatrix(Me,_n,z.reversedDepth),ue=this.localClippingEnabled,oe=B.init(this.clippingPlanes,ue),b=Oe.get(T,w.length),b.init(),w.push(b),$.enabled===!0&&$.isPresenting===!0){let Ce=S.xr.getDepthSensingMesh();Ce!==null&&Go(Ce,z,-1/0,S.sortObjects)}Go(T,z,0,S.sortObjects),b.finish(),S.sortObjects===!0&&b.sort(st,rt),pe=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,pe&&ie.addToRenderList(b,T),this.info.render.frame++,oe===!0&&B.beginShadows();let X=A.state.shadowsArray;if(J.render(X,T,z),oe===!0&&B.endShadows(),this.info.autoReset===!0&&this.info.reset(),(q&&_.hasRenderPass())===!1){let Ce=b.opaque,_e=b.transmissive;if(A.setupLights(),z.isArrayCamera){let Pe=z.cameras;if(_e.length>0)for(let Fe=0,Ze=Pe.length;Fe<Ze;Fe++){let $e=Pe[Fe];Ic(Ce,_e,T,$e)}pe&&ie.render(T);for(let Fe=0,Ze=Pe.length;Fe<Ze;Fe++){let $e=Pe[Fe];Pc(b,T,$e,$e.viewport)}}else _e.length>0&&Ic(Ce,_e,T,z),pe&&ie.render(T),Pc(b,T,z)}O!==null&&F===0&&(N.updateMultisampleRenderTarget(O),N.updateRenderTargetMipmap(O)),q&&_.end(S),T.isScene===!0&&T.onAfterRender(S,T,z),ne.resetDefaultState(),G=-1,H=null,C.pop(),C.length>0?(A=C[C.length-1],oe===!0&&B.setGlobalState(S.clippingPlanes,A.state.camera)):A=null,w.pop(),w.length>0?b=w[w.length-1]:b=null};function Go(T,z,Y,q){if(T.visible===!1)return;if(T.layers.test(z.layers)){if(T.isGroup)Y=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(z);else if(T.isLight)A.pushLight(T),T.castShadow&&A.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||k.intersectsSprite(T)){q&&Se.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Me);let Ce=we.update(T),_e=T.material;_e.visible&&b.push(T,Ce,_e,Y,Se.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||k.intersectsObject(T))){let Ce=we.update(T),_e=T.material;if(q&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Se.copy(T.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),Se.copy(Ce.boundingSphere.center)),Se.applyMatrix4(T.matrixWorld).applyMatrix4(Me)),Array.isArray(_e)){let Pe=Ce.groups;for(let Fe=0,Ze=Pe.length;Fe<Ze;Fe++){let $e=Pe[Fe],Ne=_e[$e.materialIndex];Ne&&Ne.visible&&b.push(T,Ce,Ne,Y,Se.z,$e)}}else _e.visible&&b.push(T,Ce,_e,Y,Se.z,null)}}let xe=T.children;for(let Ce=0,_e=xe.length;Ce<_e;Ce++)Go(xe[Ce],z,Y,q)}function Pc(T,z,Y,q){let{opaque:X,transmissive:xe,transparent:Ce}=T;A.setupLightsView(Y),oe===!0&&B.setGlobalState(S.clippingPlanes,Y),q&&Ee.viewport(V.copy(q)),X.length>0&&gr(X,z,Y),xe.length>0&&gr(xe,z,Y),Ce.length>0&&gr(Ce,z,Y),Ee.buffers.depth.setTest(!0),Ee.buffers.depth.setMask(!0),Ee.buffers.color.setMask(!0),Ee.setPolygonOffset(!1)}function Ic(T,z,Y,q){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[q.id]===void 0){let Ne=Ve.has("EXT_color_buffer_half_float")||Ve.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[q.id]=new yt(1,1,{generateMipmaps:!0,type:Ne?Pt:Ut,minFilter:Dn,samples:Math.max(4,je.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace})}let xe=A.state.transmissionRenderTarget[q.id],Ce=q.viewport||V;xe.setSize(Ce.z*S.transmissionResolutionScale,Ce.w*S.transmissionResolutionScale);let _e=S.getRenderTarget(),Pe=S.getActiveCubeFace(),Fe=S.getActiveMipmapLevel();S.setRenderTarget(xe),S.getClearColor(se),ge=S.getClearAlpha(),ge<1&&S.setClearColor(16777215,.5),S.clear(),pe&&ie.render(Y);let Ze=S.toneMapping;S.toneMapping=un;let $e=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),A.setupLightsView(q),oe===!0&&B.setGlobalState(S.clippingPlanes,q),gr(T,Y,q),N.updateMultisampleRenderTarget(xe),N.updateRenderTargetMipmap(xe),Ve.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let mt=0,Tt=z.length;mt<Tt;mt++){let wt=z[mt],{object:gt,geometry:Ht,material:Ie,group:nn}=wt;if(Ie.side===In&&gt.layers.test(q.layers)){let at=Ie.side;Ie.side=Jt,Ie.needsUpdate=!0,Dc(gt,Y,q,Ht,Ie,nn),Ie.side=at,Ie.needsUpdate=!0,Ne=!0}}Ne===!0&&(N.updateMultisampleRenderTarget(xe),N.updateRenderTargetMipmap(xe))}S.setRenderTarget(_e,Pe,Fe),S.setClearColor(se,ge),$e!==void 0&&(q.viewport=$e),S.toneMapping=Ze}function gr(T,z,Y){let q=z.isScene===!0?z.overrideMaterial:null;for(let X=0,xe=T.length;X<xe;X++){let Ce=T[X],{object:_e,geometry:Pe,group:Fe}=Ce,Ze=Ce.material;Ze.allowOverride===!0&&q!==null&&(Ze=q),_e.layers.test(Y.layers)&&Dc(_e,z,Y,Pe,Ze,Fe)}}function Dc(T,z,Y,q,X,xe){T.onBeforeRender(S,z,Y,q,X,xe),T.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),X.onBeforeRender(S,z,Y,q,T,xe),X.transparent===!0&&X.side===In&&X.forceSinglePass===!1?(X.side=Jt,X.needsUpdate=!0,S.renderBufferDirect(Y,z,q,X,T,xe),X.side=Xn,X.needsUpdate=!0,S.renderBufferDirect(Y,z,q,X,T,xe),X.side=In):S.renderBufferDirect(Y,z,q,X,T,xe),T.onAfterRender(S,z,Y,q,X,xe)}function vr(T,z,Y){z.isScene!==!0&&(z=be);let q=y.get(T),X=A.state.lights,xe=A.state.shadowsArray,Ce=X.state.version,_e=de.getParameters(T,X.state,xe,z,Y),Pe=de.getProgramCacheKey(_e),Fe=q.programs;q.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?z.environment:null,q.fog=z.fog;let Ze=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;q.envMap=j.get(T.envMap||q.environment,Ze),q.envMapRotation=q.environment!==null&&T.envMap===null?z.environmentRotation:T.envMapRotation,Fe===void 0&&(T.addEventListener("dispose",tt),Fe=new Map,q.programs=Fe);let $e=Fe.get(Pe);if($e!==void 0){if(q.currentProgram===$e&&q.lightsStateVersion===Ce)return Fc(T,_e),$e}else _e.uniforms=de.getUniforms(T),T.onBeforeCompile(_e,S),$e=de.acquireProgram(_e,Pe),Fe.set(Pe,$e),q.uniforms=_e.uniforms;let Ne=q.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ne.clippingPlanes=B.uniform),Fc(T,_e),q.needsLights=_f(T),q.lightsStateVersion=Ce,q.needsLights&&(Ne.ambientLightColor.value=X.state.ambient,Ne.lightProbe.value=X.state.probe,Ne.directionalLights.value=X.state.directional,Ne.directionalLightShadows.value=X.state.directionalShadow,Ne.spotLights.value=X.state.spot,Ne.spotLightShadows.value=X.state.spotShadow,Ne.rectAreaLights.value=X.state.rectArea,Ne.ltc_1.value=X.state.rectAreaLTC1,Ne.ltc_2.value=X.state.rectAreaLTC2,Ne.pointLights.value=X.state.point,Ne.pointLightShadows.value=X.state.pointShadow,Ne.hemisphereLights.value=X.state.hemi,Ne.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ne.spotLightMatrix.value=X.state.spotLightMatrix,Ne.spotLightMap.value=X.state.spotLightMap,Ne.pointShadowMatrix.value=X.state.pointShadowMatrix),q.currentProgram=$e,q.uniformsList=null,$e}function Lc(T){if(T.uniformsList===null){let z=T.currentProgram.getUniforms();T.uniformsList=gs.seqWithValue(z.seq,T.uniforms)}return T.uniformsList}function Fc(T,z){let Y=y.get(T);Y.outputColorSpace=z.outputColorSpace,Y.batching=z.batching,Y.batchingColor=z.batchingColor,Y.instancing=z.instancing,Y.instancingColor=z.instancingColor,Y.instancingMorph=z.instancingMorph,Y.skinning=z.skinning,Y.morphTargets=z.morphTargets,Y.morphNormals=z.morphNormals,Y.morphColors=z.morphColors,Y.morphTargetsCount=z.morphTargetsCount,Y.numClippingPlanes=z.numClippingPlanes,Y.numIntersection=z.numClipIntersection,Y.vertexAlphas=z.vertexAlphas,Y.vertexTangents=z.vertexTangents,Y.toneMapping=z.toneMapping}function vf(T,z,Y,q,X){z.isScene!==!0&&(z=be),N.resetTextureUnits();let xe=z.fog,Ce=q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial?z.environment:null,_e=O===null?S.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:qn,Pe=q.isMeshStandardMaterial||q.isMeshLambertMaterial&&!q.envMap||q.isMeshPhongMaterial&&!q.envMap,Fe=j.get(q.envMap||Ce,Pe),Ze=q.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,$e=!!Y.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Ne=!!Y.morphAttributes.position,mt=!!Y.morphAttributes.normal,Tt=!!Y.morphAttributes.color,wt=un;q.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(wt=S.toneMapping);let gt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Ht=gt!==void 0?gt.length:0,Ie=y.get(q),nn=A.state.lights;if(oe===!0&&(ue===!0||T!==H)){let Ft=T===H&&q.id===G;B.setState(q,T,Ft)}let at=!1;q.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==nn.state.version||Ie.outputColorSpace!==_e||X.isBatchedMesh&&Ie.batching===!1||!X.isBatchedMesh&&Ie.batching===!0||X.isBatchedMesh&&Ie.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Ie.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Ie.instancing===!1||!X.isInstancedMesh&&Ie.instancing===!0||X.isSkinnedMesh&&Ie.skinning===!1||!X.isSkinnedMesh&&Ie.skinning===!0||X.isInstancedMesh&&Ie.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ie.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ie.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ie.instancingMorph===!1&&X.morphTexture!==null||Ie.envMap!==Fe||q.fog===!0&&Ie.fog!==xe||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==B.numPlanes||Ie.numIntersection!==B.numIntersection)||Ie.vertexAlphas!==Ze||Ie.vertexTangents!==$e||Ie.morphTargets!==Ne||Ie.morphNormals!==mt||Ie.morphColors!==Tt||Ie.toneMapping!==wt||Ie.morphTargetsCount!==Ht)&&(at=!0):(at=!0,Ie.__version=q.version);let mn=Ie.currentProgram;at===!0&&(mn=vr(q,z,X));let bn=!1,_i=!1,qi=!1,vt=mn.getUniforms(),Gt=Ie.uniforms;if(Ee.useProgram(mn.program)&&(bn=!0,_i=!0,qi=!0),q.id!==G&&(G=q.id,_i=!0),bn||H!==T){Ee.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),vt.setValue(P,"projectionMatrix",T.projectionMatrix),vt.setValue(P,"viewMatrix",T.matrixWorldInverse);let ei=vt.map.cameraPosition;ei!==void 0&&ei.setValue(P,he.setFromMatrixPosition(T.matrixWorld)),je.logarithmicDepthBuffer&&vt.setValue(P,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&vt.setValue(P,"isOrthographic",T.isOrthographicCamera===!0),H!==T&&(H=T,_i=!0,qi=!0)}if(Ie.needsLights&&(nn.state.directionalShadowMap.length>0&&vt.setValue(P,"directionalShadowMap",nn.state.directionalShadowMap,N),nn.state.spotShadowMap.length>0&&vt.setValue(P,"spotShadowMap",nn.state.spotShadowMap,N),nn.state.pointShadowMap.length>0&&vt.setValue(P,"pointShadowMap",nn.state.pointShadowMap,N)),X.isSkinnedMesh){vt.setOptional(P,X,"bindMatrix"),vt.setOptional(P,X,"bindMatrixInverse");let Ft=X.skeleton;Ft&&(Ft.boneTexture===null&&Ft.computeBoneTexture(),vt.setValue(P,"boneTexture",Ft.boneTexture,N))}X.isBatchedMesh&&(vt.setOptional(P,X,"batchingTexture"),vt.setValue(P,"batchingTexture",X._matricesTexture,N),vt.setOptional(P,X,"batchingIdTexture"),vt.setValue(P,"batchingIdTexture",X._indirectTexture,N),vt.setOptional(P,X,"batchingColorTexture"),X._colorsTexture!==null&&vt.setValue(P,"batchingColorTexture",X._colorsTexture,N));let Qn=Y.morphAttributes;if((Qn.position!==void 0||Qn.normal!==void 0||Qn.color!==void 0)&&ee.update(X,Y,mn),(_i||Ie.receiveShadow!==X.receiveShadow)&&(Ie.receiveShadow=X.receiveShadow,vt.setValue(P,"receiveShadow",X.receiveShadow)),(q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial)&&q.envMap===null&&z.environment!==null&&(Gt.envMapIntensity.value=z.environmentIntensity),Gt.dfgLUT!==void 0&&(Gt.dfgLUT.value=Wg()),_i&&(vt.setValue(P,"toneMappingExposure",S.toneMappingExposure),Ie.needsLights&&xf(Gt,qi),xe&&q.fog===!0&&Le.refreshFogUniforms(Gt,xe),Le.refreshMaterialUniforms(Gt,q,Be,me,A.state.transmissionRenderTarget[T.id]),gs.upload(P,Lc(Ie),Gt,N)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(gs.upload(P,Lc(Ie),Gt,N),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&vt.setValue(P,"center",X.center),vt.setValue(P,"modelViewMatrix",X.modelViewMatrix),vt.setValue(P,"normalMatrix",X.normalMatrix),vt.setValue(P,"modelMatrix",X.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let Ft=q.uniformsGroups;for(let ei=0,Yi=Ft.length;ei<Yi;ei++){let Nc=Ft[ei];Te.update(Nc,mn),Te.bind(Nc,mn)}}return mn}function xf(T,z){T.ambientLightColor.needsUpdate=z,T.lightProbe.needsUpdate=z,T.directionalLights.needsUpdate=z,T.directionalLightShadows.needsUpdate=z,T.pointLights.needsUpdate=z,T.pointLightShadows.needsUpdate=z,T.spotLights.needsUpdate=z,T.spotLightShadows.needsUpdate=z,T.rectAreaLights.needsUpdate=z,T.hemisphereLights.needsUpdate=z}function _f(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return O},this.setRenderTargetTextures=function(T,z,Y){let q=y.get(T);q.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),y.get(T.texture).__webglTexture=z,y.get(T.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:Y,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,z){let Y=y.get(T);Y.__webglFramebuffer=z,Y.__useDefaultFramebuffer=z===void 0};let yf=P.createFramebuffer();this.setRenderTarget=function(T,z=0,Y=0){O=T,R=z,F=Y;let q=null,X=!1,xe=!1;if(T){let _e=y.get(T);if(_e.__useDefaultFramebuffer!==void 0){Ee.bindFramebuffer(P.FRAMEBUFFER,_e.__webglFramebuffer),V.copy(T.viewport),W.copy(T.scissor),re=T.scissorTest,Ee.viewport(V),Ee.scissor(W),Ee.setScissorTest(re),G=-1;return}else if(_e.__webglFramebuffer===void 0)N.setupRenderTarget(T);else if(_e.__hasExternalTextures)N.rebindTextures(T,y.get(T.texture).__webglTexture,y.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Ze=T.depthTexture;if(_e.__boundDepthTexture!==Ze){if(Ze!==null&&y.has(Ze)&&(T.width!==Ze.image.width||T.height!==Ze.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");N.setupDepthRenderbuffer(T)}}let Pe=T.texture;(Pe.isData3DTexture||Pe.isDataArrayTexture||Pe.isCompressedArrayTexture)&&(xe=!0);let Fe=y.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Fe[z])?q=Fe[z][Y]:q=Fe[z],X=!0):T.samples>0&&N.useMultisampledRTT(T)===!1?q=y.get(T).__webglMultisampledFramebuffer:Array.isArray(Fe)?q=Fe[Y]:q=Fe,V.copy(T.viewport),W.copy(T.scissor),re=T.scissorTest}else V.copy(Z).multiplyScalar(Be).floor(),W.copy(ae).multiplyScalar(Be).floor(),re=fe;if(Y!==0&&(q=yf),Ee.bindFramebuffer(P.FRAMEBUFFER,q)&&Ee.drawBuffers(T,q),Ee.viewport(V),Ee.scissor(W),Ee.setScissorTest(re),X){let _e=y.get(T.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+z,_e.__webglTexture,Y)}else if(xe){let _e=z;for(let Pe=0;Pe<T.textures.length;Pe++){let Fe=y.get(T.textures[Pe]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Pe,Fe.__webglTexture,Y,_e)}}else if(T!==null&&Y!==0){let _e=y.get(T.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,_e.__webglTexture,Y)}G=-1},this.readRenderTargetPixels=function(T,z,Y,q,X,xe,Ce,_e=0){if(!(T&&T.isWebGLRenderTarget)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=y.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ce!==void 0&&(Pe=Pe[Ce]),Pe){Ee.bindFramebuffer(P.FRAMEBUFFER,Pe);try{let Fe=T.textures[_e],Ze=Fe.format,$e=Fe.type;if(T.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+_e),!je.textureFormatReadable(Ze)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!je.textureTypeReadable($e)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=T.width-q&&Y>=0&&Y<=T.height-X&&P.readPixels(z,Y,q,X,te.convert(Ze),te.convert($e),xe)}finally{let Fe=O!==null?y.get(O).__webglFramebuffer:null;Ee.bindFramebuffer(P.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(T,z,Y,q,X,xe,Ce,_e=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pe=y.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ce!==void 0&&(Pe=Pe[Ce]),Pe)if(z>=0&&z<=T.width-q&&Y>=0&&Y<=T.height-X){Ee.bindFramebuffer(P.FRAMEBUFFER,Pe);let Fe=T.textures[_e],Ze=Fe.format,$e=Fe.type;if(T.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+_e),!je.textureFormatReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!je.textureTypeReadable($e))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ne=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Ne),P.bufferData(P.PIXEL_PACK_BUFFER,xe.byteLength,P.STREAM_READ),P.readPixels(z,Y,q,X,te.convert(Ze),te.convert($e),0);let mt=O!==null?y.get(O).__webglFramebuffer:null;Ee.bindFramebuffer(P.FRAMEBUFFER,mt);let Tt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Fh(P,Tt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Ne),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,xe),P.deleteBuffer(Ne),P.deleteSync(Tt),xe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,z=null,Y=0){let q=Math.pow(2,-Y),X=Math.floor(T.image.width*q),xe=Math.floor(T.image.height*q),Ce=z!==null?z.x:0,_e=z!==null?z.y:0;N.setTexture2D(T,0),P.copyTexSubImage2D(P.TEXTURE_2D,Y,0,0,Ce,_e,X,xe),Ee.unbindTexture()};let Mf=P.createFramebuffer(),bf=P.createFramebuffer();this.copyTextureToTexture=function(T,z,Y=null,q=null,X=0,xe=0){let Ce,_e,Pe,Fe,Ze,$e,Ne,mt,Tt,wt=T.isCompressedTexture?T.mipmaps[xe]:T.image;if(Y!==null)Ce=Y.max.x-Y.min.x,_e=Y.max.y-Y.min.y,Pe=Y.isBox3?Y.max.z-Y.min.z:1,Fe=Y.min.x,Ze=Y.min.y,$e=Y.isBox3?Y.min.z:0;else{let Gt=Math.pow(2,-X);Ce=Math.floor(wt.width*Gt),_e=Math.floor(wt.height*Gt),T.isDataArrayTexture?Pe=wt.depth:T.isData3DTexture?Pe=Math.floor(wt.depth*Gt):Pe=1,Fe=0,Ze=0,$e=0}q!==null?(Ne=q.x,mt=q.y,Tt=q.z):(Ne=0,mt=0,Tt=0);let gt=te.convert(z.format),Ht=te.convert(z.type),Ie;z.isData3DTexture?(N.setTexture3D(z,0),Ie=P.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(N.setTexture2DArray(z,0),Ie=P.TEXTURE_2D_ARRAY):(N.setTexture2D(z,0),Ie=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,z.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,z.unpackAlignment);let nn=P.getParameter(P.UNPACK_ROW_LENGTH),at=P.getParameter(P.UNPACK_IMAGE_HEIGHT),mn=P.getParameter(P.UNPACK_SKIP_PIXELS),bn=P.getParameter(P.UNPACK_SKIP_ROWS),_i=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,wt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,wt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Fe),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ze),P.pixelStorei(P.UNPACK_SKIP_IMAGES,$e);let qi=T.isDataArrayTexture||T.isData3DTexture,vt=z.isDataArrayTexture||z.isData3DTexture;if(T.isDepthTexture){let Gt=y.get(T),Qn=y.get(z),Ft=y.get(Gt.__renderTarget),ei=y.get(Qn.__renderTarget);Ee.bindFramebuffer(P.READ_FRAMEBUFFER,Ft.__webglFramebuffer),Ee.bindFramebuffer(P.DRAW_FRAMEBUFFER,ei.__webglFramebuffer);for(let Yi=0;Yi<Pe;Yi++)qi&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,y.get(T).__webglTexture,X,$e+Yi),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,y.get(z).__webglTexture,xe,Tt+Yi)),P.blitFramebuffer(Fe,Ze,Ce,_e,Ne,mt,Ce,_e,P.DEPTH_BUFFER_BIT,P.NEAREST);Ee.bindFramebuffer(P.READ_FRAMEBUFFER,null),Ee.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(X!==0||T.isRenderTargetTexture||y.has(T)){let Gt=y.get(T),Qn=y.get(z);Ee.bindFramebuffer(P.READ_FRAMEBUFFER,Mf),Ee.bindFramebuffer(P.DRAW_FRAMEBUFFER,bf);for(let Ft=0;Ft<Pe;Ft++)qi?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Gt.__webglTexture,X,$e+Ft):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Gt.__webglTexture,X),vt?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Qn.__webglTexture,xe,Tt+Ft):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Qn.__webglTexture,xe),X!==0?P.blitFramebuffer(Fe,Ze,Ce,_e,Ne,mt,Ce,_e,P.COLOR_BUFFER_BIT,P.NEAREST):vt?P.copyTexSubImage3D(Ie,xe,Ne,mt,Tt+Ft,Fe,Ze,Ce,_e):P.copyTexSubImage2D(Ie,xe,Ne,mt,Fe,Ze,Ce,_e);Ee.bindFramebuffer(P.READ_FRAMEBUFFER,null),Ee.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else vt?T.isDataTexture||T.isData3DTexture?P.texSubImage3D(Ie,xe,Ne,mt,Tt,Ce,_e,Pe,gt,Ht,wt.data):z.isCompressedArrayTexture?P.compressedTexSubImage3D(Ie,xe,Ne,mt,Tt,Ce,_e,Pe,gt,wt.data):P.texSubImage3D(Ie,xe,Ne,mt,Tt,Ce,_e,Pe,gt,Ht,wt):T.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,xe,Ne,mt,Ce,_e,gt,Ht,wt.data):T.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,xe,Ne,mt,wt.width,wt.height,gt,wt.data):P.texSubImage2D(P.TEXTURE_2D,xe,Ne,mt,Ce,_e,gt,Ht,wt);P.pixelStorei(P.UNPACK_ROW_LENGTH,nn),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,at),P.pixelStorei(P.UNPACK_SKIP_PIXELS,mn),P.pixelStorei(P.UNPACK_SKIP_ROWS,bn),P.pixelStorei(P.UNPACK_SKIP_IMAGES,_i),xe===0&&z.generateMipmaps&&P.generateMipmap(Ie),Ee.unbindTexture()},this.initRenderTarget=function(T){y.get(T).__webglFramebuffer===void 0&&N.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?N.setTextureCube(T,0):T.isData3DTexture?N.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?N.setTexture2DArray(T,0):N.setTexture2D(T,0),Ee.unbindTexture()},this.resetState=function(){R=0,F=0,O=null,Ee.reset(),ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _n}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=nt._getDrawingBufferColorSpace(e),t.unpackColorSpace=nt._getUnpackColorSpace()}};var bt=`// ===== \u516C\u5171\u5E38\u6570\u4E0E\u566A\u58F0 =====
#define PI 3.14159265358979
#define TAU 6.28318530717959
const float RING_R = 50000.0;   // \u73AF\u534A\u5F84 km
const float HALF_W = 500.0;     // \u73AF\u5E26\u534A\u5BBD km
const float WALL_H = 50.0;      // \u8FB9\u5899\u9AD8 km

float sat(float x) { return clamp(x, 0.0, 1.0); }
vec3 sat3(vec3 x) { return clamp(x, 0.0, 1.0); }
float sq(float x) { return x * x; }
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

// Hash without sine\uFF08\u4E0E weather.ts \u4E2D hash3 \u4E00\u81F4\uFF09
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}

float vnoise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float vnoise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float a = hash13(i);
  float b = hash13(i + vec3(1.0, 0.0, 0.0));
  float c = hash13(i + vec3(0.0, 1.0, 0.0));
  float d = hash13(i + vec3(1.0, 1.0, 0.0));
  float e = hash13(i + vec3(0.0, 0.0, 1.0));
  float f1 = hash13(i + vec3(1.0, 0.0, 1.0));
  float g = hash13(i + vec3(0.0, 1.0, 1.0));
  float h = hash13(i + vec3(1.0, 1.0, 1.0));
  return mix(mix(mix(a, b, u.x), mix(c, d, u.x), u.y), mix(mix(e, f1, u.x), mix(g, h, u.x), u.y), u.z);
}

// x\u3001z \u65B9\u5411\u4EE5 period \u4E3A\u5468\u671F\u7684 3D \u503C\u566A\u58F0\uFF08\u4E0E weather.ts \u4E2D vnoise3 \u4E00\u81F4\uFF09
float vnoise3p(vec3 p, float period) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float x0 = mod(i.x, period), x1 = mod(i.x + 1.0, period);
  float z0 = mod(i.z, period), z1 = mod(i.z + 1.0, period);
  float a = hash13(vec3(x0, i.y, z0));
  float b = hash13(vec3(x1, i.y, z0));
  float c = hash13(vec3(x0, i.y + 1.0, z0));
  float d = hash13(vec3(x1, i.y + 1.0, z0));
  float e = hash13(vec3(x0, i.y, z1));
  float f1 = hash13(vec3(x1, i.y, z1));
  float g = hash13(vec3(x0, i.y + 1.0, z1));
  float h = hash13(vec3(x1, i.y + 1.0, z1));
  float l0 = mix(a, b, u.x);
  float l1 = mix(c, d, u.x);
  float l2 = mix(e, f1, u.x);
  float l3 = mix(g, h, u.x);
  return mix(mix(l0, l1, u.y), mix(l2, l3, u.y), u.z);
}

// \u68AF\u5EA6\u566A\u58F0\uFF08-1..1 \u5DE6\u53F3\uFF09
float gnoise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec3 g000 = hash33(i) * 2.0 - 1.0;
  vec3 g100 = hash33(i + vec3(1, 0, 0)) * 2.0 - 1.0;
  vec3 g010 = hash33(i + vec3(0, 1, 0)) * 2.0 - 1.0;
  vec3 g110 = hash33(i + vec3(1, 1, 0)) * 2.0 - 1.0;
  vec3 g001 = hash33(i + vec3(0, 0, 1)) * 2.0 - 1.0;
  vec3 g101 = hash33(i + vec3(1, 0, 1)) * 2.0 - 1.0;
  vec3 g011 = hash33(i + vec3(0, 1, 1)) * 2.0 - 1.0;
  vec3 g111 = hash33(i + vec3(1, 1, 1)) * 2.0 - 1.0;
  float n000 = dot(g000, f);
  float n100 = dot(g100, f - vec3(1, 0, 0));
  float n010 = dot(g010, f - vec3(0, 1, 0));
  float n110 = dot(g110, f - vec3(1, 1, 0));
  float n001 = dot(g001, f - vec3(0, 0, 1));
  float n101 = dot(g101, f - vec3(1, 0, 1));
  float n011 = dot(g011, f - vec3(0, 1, 1));
  float n111 = dot(g111, f - vec3(1, 1, 1));
  return mix(mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y), mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y), u.z);
}

float gnoise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 ga = hash22(i) * 2.0 - 1.0;
  vec2 gb = hash22(i + vec2(1.0, 0.0)) * 2.0 - 1.0;
  vec2 gc = hash22(i + vec2(0.0, 1.0)) * 2.0 - 1.0;
  vec2 gd = hash22(i + vec2(1.0, 1.0)) * 2.0 - 1.0;
  float va = dot(ga, f);
  float vb = dot(gb, f - vec2(1.0, 0.0));
  float vc = dot(gc, f - vec2(0.0, 1.0));
  float vd = dot(gd, f - vec2(1.0, 1.0));
  return mix(mix(va, vb, u.x), mix(vc, vd, u.x), u.y);
}

float fbm2(vec2 p, int oct) {
  float s = 0.0, a = 0.5, n = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= oct) break;
    s += a * vnoise2(p);
    n += a;
    p = p * 2.03 + vec2(17.1, 9.7);
    a *= 0.5;
  }
  return s / n;
}

// \u7EBF\u5BBD\u8986\u76D6\u7387\uFF1Adist \u4E3A\u5230\u7EBF\u4E2D\u5FC3\u8DDD\u79BB\uFF0Chw \u4E3A\u534A\u5BBD\uFF0Chp \u4E3A\u534A\u4E2A\u50CF\u7D20\uFF08\u540C\u4E00\u5355\u4F4D\uFF09
float lineCov(float dist, float hw, float hp) {
  return clamp((min(dist + hp, hw) - max(dist - hp, -hw)) / (2.0 * hp), 0.0, 1.0);
}

// \u4EBA\u5DE5\u663C\u591C\uFF1A\u672C\u5730\u65F6 \u2192 \u8C03\u5149\u8FDB\u5EA6
float dayRamp(float h) {
  h = mod(h, 24.0);
  if (h < 4.5 || h >= 19.5) return 0.0;
  if (h < 7.5) return smoothstep(0.0, 1.0, (h - 4.5) / 3.0);
  if (h < 16.5) return 1.0;
  return smoothstep(0.0, 1.0, (19.5 - h) / 3.0);
}
float dayIntensity(float h) {
  float s = dayRamp(h);
  return (exp(5.6 * s) - 1.0) / (exp(5.6) - 1.0);
}
vec3 mirrorTint(float h) {
  float w = 1.0 - dayRamp(h);
  return vec3(1.0, 0.965 - 0.07 * w, 0.925 - 0.16 * w);
}
`;var xo=`// ===== \u5927\u6C14\u4E0E\u5149\u7167\u516C\u5171\u9879\uFF08\u957F\u5EA6\u5355\u4F4D km\uFF09 =====
const vec3 BR = vec3(5.802e-3, 13.558e-3, 33.1e-3); // \u745E\u5229\u6563\u5C04\u7CFB\u6570 /km
const float HR = 8.0;
const float HM = 1.2;

uniform float uMieK;      // \u7C73\u6C0F\u6563\u5C04\u7CFB\u6570 /km\uFF08\u968F\u5929\u6C14\uFF09
uniform float uMieG;
uniform float uRainExt;   // \u964D\u96E8\u5E26\u6765\u7684\u7070\u8272\u6D88\u5149 /km\uFF08\u8FD1\u5730\u5C42\uFF09
uniform vec3 uDayE;       // \u6EE1\u663C\u955C\u5149\u7167\u5EA6\uFF08\u989C\u8272\uFF09
uniform vec3 uMirrorE;    // \u672C\u5730\u955C\u5149\u7167\u5EA6
uniform vec3 uMirrorDir;  // \u955C\u5149\u6765\u5411\uFF08\u8FD1\u5929\u9876\uFF09
uniform vec3 uArchE;      // \u5BF9\u5CB8\u5149\u7167\u5EA6
uniform vec3 uArchDir;
uniform vec3 uStarDir;    // \u6052\u661F\u672C\u5730\u65B9\u5411
uniform vec3 uStarE;      // \u6052\u661F\u6574\u76D8\u7167\u5EA6\uFF08\u5927\u6C14\u5916\uFF09
uniform float uStarAlpha; // \u6052\u661F\u89D2\u534A\u5F84
uniform float uLocalHour;
uniform vec3 uAmbSky;     // \u5929\u7A7A\u6F2B\u5C04\uFF08\u591A\u6B21\u6563\u5C04\uFF09\u7167\u5EA6\u8FD1\u4F3C
uniform float uArchMax;   // \u5BF9\u5CB8\u5149\u6700\u5927\u503C\uFF08\u6807\u91CF\uFF0C\u7528\u4E8E\u8FDC\u5904\u7684\u591C\u95F4\u5149\uFF09

float phaseR(float mu) { return 0.0596831 * (1.0 + mu * mu); }
float phaseM(float mu, float g) {
  float g2 = g * g;
  float d = max(1.0 + g2 - 2.0 * g * mu, 1e-4);
  return 0.0795775 * (1.0 - g2) / (d * sqrt(d));
}
vec3 mieExt() { return vec3(uMieK * 1.11); }

// \u7AD6\u76F4\u65B9\u5411\u4E0A\uFF0C\u9AD8\u5EA6 h \u4EE5\u4E0A\u7684\u5149\u5B66\u539A\u5EA6
vec3 tauUp(float h) {
  return BR * HR * exp(-h / HR) + mieExt() * HM * exp(-h / HM);
}

// \u6052\u661F\u9732\u51FA\u6BD4\u4F8B\uFF08\u5E26\u4E34\u8FB9\u660F\u6697\u7684\u8FD1\u4F3C\uFF09\uFF0Cx = \u9732\u51FA\u9AD8\u5EA6 / \u89D2\u534A\u5F84
float starDiskFrac(float x) {
  x = clamp(x, 0.0, 2.0);
  float y = 1.0 - x;
  float A = (acos(y) - y * sqrt(max(0.0, 1.0 - y * y))) / PI;
  float c = mix(0.5 + 0.375 * sqrt(2.0 * x), 1.0, smoothstep(0.0, 2.0, x));
  return clamp(A * c, 0.0, 1.0);
}

// \u4F4D\u4E8E (z, h)\uFF08km\uFF0Cz \u5411\u5357\u4E3A\u6B63\uFF09\u5904\u770B\u5230\u7684\u6052\u661F\u9732\u51FA\u6BD4\u4F8B\uFF1A\u5357\u5899\u5728 z = +500
float starVisAt(float zK, float hK) {
  float es = asin(clamp(uStarDir.y, -1.0, 1.0));
  float dz = max(HALF_W - zK, 0.5);
  float w = atan(WALL_H - hK, dz);
  return starDiskFrac((es + uStarAlpha - w) / uStarAlpha);
}

// \u4E91\u5C42\u4EE5\u4E0B\u7A7A\u6C14\u7684\u5E73\u5747\u53D7\u5149\uFF08\u4E0E clouds.glsl \u4E2D underCloudLight \u76F8\u540C\uFF1B\u8FD9\u91CC\u5355\u72EC\u58F0\u660E\u6240\u9700 uniform\uFF09
uniform float uCloudCover;
uniform float uCloudBase;
uniform float uCloudThick;
uniform float uCloudDark;
uniform float uStratus;
float underCloudLightA(float hKm) {
  float shade = 1.0 - uCloudCover * (0.45 + 0.5 * uStratus) * (1.0 + uCloudDark) * 0.7;
  return mix(clamp(shade, 0.08, 1.0), 1.0, smoothstep(uCloudBase, uCloudBase + uCloudThick, hKm));
}

// \u8FD1\u5904\u7269\u4F53\u7684\u7A7A\u6C14\u900F\u89C6\uFF08\u89E3\u6790\u7684\u6307\u6570\u5927\u6C14\uFF0C\u5FFD\u7565\u66F2\u7387\uFF09\u3002
// camK\uFF1A\u76F8\u673A\u4F4D\u7F6E\uFF08km\uFF09\uFF0CpK\uFF1A\u7269\u4F53\u4F4D\u7F6E\uFF08km\uFF09\u3002\u8FD4\u56DE\u900F\u5C04\u7387\uFF0Cinscat \u8F93\u51FA\u6563\u5C04\u5149\u3002
vec3 aerial(vec3 camK, vec3 pK, out vec3 inscat) {
  vec3 dv = pK - camK;
  float s = length(dv);
  vec3 d = dv / max(s, 1e-6);
  float h0 = camK.y;
  float k = d.y;
  float iR, iM;
  if (abs(k) > 1e-4) {
    iR = HR / k * (exp(-h0 / HR) - exp(-(h0 + k * s) / HR));
    iM = HM / k * (exp(-h0 / HM) - exp(-(h0 + k * s) / HM));
  } else {
    iR = s * exp(-h0 / HR);
    iM = s * exp(-h0 / HM);
  }
  float rainPath = s * uRainExt;
  vec3 tau = BR * iR + mieExt() * iM + vec3(rainPath);
  vec3 T = exp(-tau);
  float hm = max(h0 + 0.5 * k * s, 0.0);
  vec3 Tsun = exp(-tauUp(hm)) * underCloudLightA(hm);
  float mu = dot(d, uMirrorDir);
  vec3 scR = BR * iR;
  vec3 scM = vec3(uMieK * iM);
  vec3 single = (scR * phaseR(mu) + scM * phaseM(mu, uMieG)) * uMirrorE * Tsun;
  // \u5BF9\u5CB8\u5149\u3001\u5929\u5149\uFF08\u591A\u6B21\u6563\u5C04\u8FD1\u4F3C\uFF09\u6309\u5404\u5411\u540C\u6027\u5904\u7406
  vec3 iso = (scR + scM + vec3(rainPath * 0.9)) * 0.0795775 * (uArchE * 1.2 + uAmbSky);
  // \u6052\u661F\uFF08\u8FD1\u5730\u9762\u4EE5\u89C2\u5BDF\u70B9\u7684\u53EF\u89C1\u5EA6\u4E3A\u51C6\uFF0C\u7531\u8C03\u7528\u65B9\u53E6\u884C\u63D0\u4F9B\u65F6\u53EF\u8986\u76D6\uFF09
  float muS = dot(d, uStarDir);
  float vis = starVisAt(0.5 * (camK.z + pK.z), hm);
  vec3 Ts = exp(-tauUp(hm) / max(uStarDir.y + 0.02, 0.03));
  vec3 star = (scR * phaseR(muS) + scM * phaseM(muS, uMieG)) * uStarE * Ts * vis;
  vec3 frac = (1.0 - T) / max(tau, vec3(1e-6));
  inscat = (single + iso + star) * frac;
  return T;
}
`;var fu=`// ===== \u8FDC\u666F\uFF1A\u6574\u6761\u73AF\u5E26\u7684\u7A0B\u5E8F\u5316\u5730\u56FE\uFF08\u5355\u4F4D km\uFF1B\u03B8 \u4EE5\u5C0F\u9547\u4E3A 0\uFF0C\u5411\u4E1C\u4E3A\u6B63\uFF09 =====
uniform vec4 uSeasonA;   // x \u53F6\u91CF, y \u79CB\u8272, z \u67AF\u9EC4, w \u65B0\u7EFF
uniform vec4 uSeasonB;   // x \u91D1\u9EC4, y \u7A7A\u7530, z \u82B1\u671F, w \u51B7\u6696(-1..1)
uniform float uFarTime;  // \u5C0F\u65F6\uFF08\u8FDC\u5904\u4E91\u7684\u6F02\u79FB\uFF09
uniform float uFarCloudBias;

float wnd(float x, float a, float b, float s) {
  return smoothstep(a - s, a + s, x) * (1.0 - smoothstep(b - s, b + s, x));
}

// \u6309\u50CF\u7D20\u8DB3\u8FF9\u6DE1\u51FA\u9AD8\u9891\u7684\u5206\u5F62\u68AF\u5EA6\u566A\u58F0
float fbmL(vec3 p, float wl0, float fp, int maxOct) {
  float s = 0.0;
  float a = 0.5;
  float wl = wl0;
  vec3 q = p / wl0;
  for (int i = 0; i < 11; i++) {
    if (i >= maxOct) break;
    float w = sat((wl / max(fp, 1e-3) - 2.0) * 0.5);
    if (w <= 0.0) break;
    s += a * w * gnoise3(q);
    q = q * 2.02 + vec3(13.7, 7.1, 3.3);
    wl *= 0.495;
    a *= 0.5;
  }
  return s;
}

float ridgedL(vec3 p, float wl0, float fp, int maxOct) {
  float s = 0.0;
  float a = 0.5;
  float wl = wl0;
  vec3 q = p / wl0;
  float prev = 1.0;
  for (int i = 0; i < 9; i++) {
    if (i >= maxOct) break;
    float w = sat((wl / max(fp, 1e-3) - 2.0) * 0.5);
    float n = 1.0 - abs(gnoise3(q) * 1.6);
    n = n * n;
    if (w > 0.0) s += a * w * n * prev;
    prev = n;
    q = q * 2.03 + vec3(5.3, 11.9, 2.1);
    wl *= 0.49;
    a *= 0.5;
  }
  return s;
}

// \u8F90\u6761\u843D\u70B9\u9644\u8FD1\u7684\u300C\u8F90\u6761\u57CE\u300D
float spokeCity(float deg, float zK) {
  float c = 0.0;
  for (int k = 0; k < 6; k++) {
    float lon = -35.0 + 60.0 * float(k);
    float dd = mod(deg - lon + 540.0, 360.0) - 180.0;
    float du = radians(dd) * RING_R;
    c += exp(-sq(du / 140.0) - sq(zK / 210.0));
  }
  return c;
}

struct FarInfo {
  vec3 rad;      // \u5730\u8868\uFF08\u542B\u8FDC\u5904\u4E91\uFF09\u8F90\u4EAE\u5EA6\uFF0C\u672A\u8BA1\u5165\u5927\u6C14
  float cloud;   // \u8FDC\u5904\u4E91\u91CF
  float water;
};

// hourLoc\uFF1A\u8BE5\u5904\u672C\u5730\u65F6\uFF1Bgraze\uFF1A\u89C6\u7EBF\u4E0E\u5730\u9762\u7684\u5939\u89D2\u6B63\u5F26
FarInfo farSurface(float th, float zK, float fp, float hourLoc, float graze) {
  FarInfo o;
  float deg = degrees(th);
  vec3 P = vec3(sin(th) * RING_R, cos(th) * RING_R, zK);

  // ---------- \u6D77\u9646 ----------
  float bias = 0.0;
  bias += 0.62 * wnd(deg, -13.0, 13.0, 2.5);
  float farOcean = sat(smoothstep(136.0, 147.0, deg) + smoothstep(-139.0, -150.0, deg));
  bias -= 0.72 * farOcean;
  bias -= 0.70 * wnd(deg, 14.5, 22.5, 1.2) * smoothstep(400.0, 250.0, abs(zK - 60.0));
  bias -= 0.62 * wnd(deg, -31.5, -19.0, 1.6);
  bias -= 0.38 * wnd(deg, 97.0, 108.0, 2.5) * smoothstep(320.0, 140.0, abs(zK + 160.0));
  bias -= 0.30 * wnd(deg, 56.0, 61.0, 1.0) * smoothstep(220.0, 90.0, abs(zK - 210.0));
  // \u8FDC\u6D0B\u4E2D\u7684\u7FA4\u5C9B\uFF1A\u8F90\u6761\u843D\u70B9\u5728\u5C9B\u4E0A
  float isl = spokeCity(deg, zK);
  bias += farOcean * (0.9 * smoothstep(0.08, 0.7, isl) + 0.5 * smoothstep(0.35, 0.62, vnoise3(P / 260.0 + 3.1)));
  // \u8FB9\u5899\u4E0B\u7684\u72ED\u957F\u9646\u7F18
  bias += 0.35 * smoothstep(440.0, 492.0, abs(zK));

  float cont = fbmL(P, 2400.0, fp, 10) * 1.3 + 0.1 + bias;
  float land = smoothstep(-0.012, 0.012, cont);
  if (fp > 60.0) land = smoothstep(-fp * 0.0004, fp * 0.0004, cont);
  float shore = 1.0 - smoothstep(0.0, 0.07, abs(cont));
  o.water = 1.0 - land;

  // ---------- \u5730\u5F62\u4E0E\u751F\u7269\u7FA4\u843D ----------
  float mtn = wnd(deg, 30.0, 52.0, 4.0) * 1.0 + wnd(deg, -76.0, -61.0, 3.0) * 0.8 +
              wnd(deg, 112.0, 134.0, 4.0) * 1.15 + wnd(deg, -137.0, -121.0, 3.0) * 0.7 +
              wnd(deg, 66.0, 74.0, 2.0) * 0.45;
  float rid = ridgedL(P, 380.0, fp, 7);
  float hills = fbmL(P + 77.0, 700.0, fp, 6);
  float elev = land * max(0.0, 0.12 + 0.55 * hills + cont * 0.6 + mtn * rid * 4.6);

  float desert = wnd(deg, -58.0, -41.0, 3.0);
  float steppe = wnd(deg, 51.0, 81.0, 4.0);
  float lush = wnd(deg, 85.0, 114.0, 4.0);
  float boreal = wnd(deg, -143.0, -99.0, 5.0);
  float plain = wnd(deg, -98.0, -77.0, 3.0) + wnd(deg, -16.0, 16.0, 3.0) * 0.7 + wnd(deg, 23.0, 30.0, 2.0) * 0.6;

  float mosaic = fbmL(P + 311.0, 160.0, fp, 6);
  float forestF = sat(0.5 + mosaic * 1.8 - plain * 0.45 - steppe * 0.6 - desert * 0.9 + boreal * 0.35 + lush * 0.25 + mtn * 0.2);

  // \u5B63\u8282\u8272
  vec3 forestC = mix(vec3(0.030, 0.058, 0.024), vec3(0.035, 0.07, 0.03), uSeasonA.w);
  forestC = mix(forestC, vec3(0.11, 0.075, 0.03), uSeasonA.y * 0.75);
  forestC = mix(vec3(0.055, 0.055, 0.045), forestC, sat(uSeasonA.x * 1.3));
  vec3 borealC = vec3(0.022, 0.04, 0.026);
  vec3 grassC = mix(vec3(0.075, 0.12, 0.04), vec3(0.11, 0.16, 0.05), uSeasonA.w);
  grassC = mix(grassC, vec3(0.16, 0.14, 0.07), uSeasonA.z);
  vec3 farmC = mix(grassC, vec3(0.22, 0.19, 0.08), uSeasonB.x * 0.35);
  farmC = mix(farmC, vec3(0.17, 0.14, 0.09), uSeasonB.y * 0.6);
  farmC = mix(farmC, vec3(0.32, 0.30, 0.05), uSeasonB.z * 0.35);
  vec3 steppeC = vec3(0.21, 0.18, 0.10);
  vec3 desertC = vec3(0.40, 0.31, 0.19);
  vec3 lushC = vec3(0.03, 0.075, 0.03);
  vec3 rockC = vec3(0.17, 0.16, 0.15);
  vec3 snowC = vec3(0.78, 0.8, 0.84);

  float patchN = vnoise3(P / 18.0);
  vec3 openC = mix(grassC, farmC, sat(plain + 0.3) * smoothstep(0.3, 0.7, patchN));
  vec3 alb = mix(openC, forestC, forestF);
  alb = mix(alb, borealC, boreal * forestF);
  alb = mix(alb, lushC, lush * 0.7);
  alb = mix(alb, steppeC, steppe * (1.0 - forestF * 0.6));
  alb = mix(alb, desertC, desert * (0.7 + 0.3 * patchN));
  float rocky = sat((elev - 1.4) / 1.6) * sat(mtn * 1.5);
  alb = mix(alb, rockC, rocky);
  float snowLine = 3.3 - 0.5 * (1.0 - uSeasonB.w) * 0.5 - 0.7 * sat(-uSeasonB.w);
  float snow = smoothstep(snowLine - 0.2, snowLine + 0.4, elev + 0.25 * gnoise3(P / 30.0));
  alb = mix(alb, snowC, snow);

  // \u6CB3\u6D41
  float rn = gnoise3(P / 1500.0 + vec3(4.0, 1.0, 7.0)) + 0.35 * gnoise3(P / 420.0);
  float rdist = abs(rn) * 900.0;
  float riverW = 1.8 + 1.5 * sat(1.0 - elev);
  float river = lineCov(rdist, riverW, max(fp * 0.5, 0.05)) * land * (1.0 - desert * 0.8) * (1.0 - rocky) * step(elev, 1.6);

  // \u57CE\u9547
  float cityN = vnoise3(P / 48.0);
  float city = smoothstep(0.7, 0.92, cityN) * land * (1.0 - sat(mtn * rid * 2.0)) * (1.0 - desert * 0.6) * (0.55 + 0.9 * shore + 0.6 * lush + 0.4 * plain);
  city += spokeCity(deg, zK) * 1.6 * land;
  city += 0.25 * smoothstep(0.55, 0.8, vnoise3(P / 11.0)) * land * (0.3 + plain + lush) * (1.0 - desert);
  alb = mix(alb, vec3(0.15, 0.145, 0.14), sat(city * 0.5));

  // \u6C34\u4F53
  vec3 deepC = vec3(0.006, 0.018, 0.04);
  vec3 shallowC = vec3(0.02, 0.065, 0.075);
  vec3 waterC = mix(deepC, shallowC, smoothstep(-0.2, 0.0, cont));
  alb = mix(alb, waterC, max(o.water, river * 0.85));
  float wat = max(o.water, river * 0.85);

  // ---------- \u5149\u7167\uFF1A\u8BE5\u7ECF\u5EA6\u7684\u672C\u5730\u65F6 ----------
  float di = dayIntensity(hourLoc);
  vec3 E = uDayE * mirrorTint(hourLoc) * di;
  float nightLoc = dayIntensity(hourLoc + 12.0);
  vec3 En = vec3(0.75, 0.82, 1.0) * uArchMax * nightLoc;
  vec3 Etot = E + En;
  float slope = 1.0 - 0.18 * sat(rid * mtn);
  vec3 surf = alb * (Etot * slope * 1.18) / PI;
  // \u6C34\u9762\uFF1A\u53CD\u5C04\u8BE5\u5904\u5929\u7A7A\u4E0E\u955C\u5149
  float fres = 0.02 + 0.98 * pow(1.0 - sat(graze), 5.0);
  surf += wat * Etot * (0.012 + 0.06 * fres) * vec3(0.55, 0.7, 1.0);

  // ---------- \u8FDC\u5904\u7684\u4E91 ----------
  vec3 Pc = P + vec3(uFarTime * 23.0, -uFarTime * 17.0, uFarTime * 2.5);
  vec3 wq = Pc / 900.0;
  Pc += vec3(gnoise3(wq), gnoise3(wq + 5.2), gnoise3(wq + 9.1)) * 380.0;
  float cb = fbmL(Pc, 620.0, fp, 7);
  vec3 bq = vec3(P.x / 2300.0, P.y / 2300.0, zK / 75.0) + vec3(0.0, uFarTime * 0.004, 0.0);
  bq += vec3(gnoise3(bq * 1.9 + 3.0), gnoise3(bq * 1.9 + 9.0), gnoise3(bq * 1.3 + 1.0) * 2.0) * 0.6;
  float band = gnoise3(bq) + 0.5 * gnoise3(bq * 2.3 + 4.0);
  float wallBand = exp(-sq((HALF_W - abs(zK)) / 55.0));
  float cv = cb * 1.1 + band * 0.35 + wallBand * 0.5 + o.water * 0.1 + mtn * 0.12 + lush * 0.1 - desert * 0.3 + uFarCloudBias;
  float cloud = smoothstep(0.12, 0.42, cv);
  // \u659C\u770B\u65F6\u4E91\u7684\u4FA7\u9762\u906E\u4F4F\u66F4\u591A\u5730\u9762
  cloud = 1.0 - pow(1.0 - cloud, 1.0 / clamp(graze * 2.2 + 0.18, 0.25, 1.0));
  vec3 cloudC = vec3(0.86, 0.87, 0.9) * Etot * 1.05 / PI;
  surf = mix(surf, cloudC, cloud);

  // \u591C\u706F\uFF1A\u5165\u591C\u540E\u4EAE\uFF0C\u540E\u534A\u591C\u7184\u53BB\u4E00\u90E8\u5206
  float hl = mod(hourLoc, 24.0);
  float lateNight = smoothstep(23.0, 1.5, hl) * step(hl, 12.0) + step(12.0, hl);
  lateNight = mix(0.55, 1.0, sat(lateNight));
  float lightsOn = (1.0 - dayRamp(hourLoc)) * lateNight;
  vec3 cityLight = vec3(1.0, 0.72, 0.42) * city * (0.6 + 0.5 * vnoise3(P / 3.0)) * 0.0006;
  surf += cityLight * lightsOn * (1.0 - cloud * 0.8) * smoothstep(0.0, 0.1, graze);

  o.rad = surf;
  o.cloud = cloud;
  return o;
}
`;var _o=`// ===== \u672C\u5730\u4F4E\u4E91\u573A\uFF08\u4E0E weather.ts \u7684 cloudField \u4E00\u81F4\uFF09\uFF0Cuv \u5355\u4F4D km =====
uniform float uShowers;
uniform float uHighCloud;
uniform vec2 uCloudOff;
uniform float uCloudEvo;
uniform float uRain;
uniform float uFogNow;

float cloudField2(vec2 uv) {
  float sx = (uv.x - uCloudOff.x) / 3.2;
  float sz = (uv.y - uCloudOff.y) / 3.2;
  float n = 0.0, amp = 0.5, f = 1.0, nrm = 0.0;
  for (int i = 0; i < 4; i++) {
    n += amp * vnoise3p(vec3(sx * f, uCloudEvo * f * 0.7 + float(i) * 17.0, sz * f), 1440.0 * f);
    nrm += amp;
    amp *= 0.5;
    f *= 2.03;
  }
  n /= nrm;
  float cell = vnoise3p(vec3((uv.x - uCloudOff.x) / 14.4, uCloudEvo * 0.5 + 91.0, (uv.y - uCloudOff.y) / 14.4), 320.0);
  n = n * (1.0 - 0.45 * uShowers) + cell * 0.45 * uShowers;
  float thr = 1.0 - uCloudCover;
  return sat((n - thr * 0.92 - 0.04) / 0.22);
}

// \u4E91\u5F71\uFF1A\u955C\u5149\u4ECE\u5934\u9876\u7167\u4E0B\uFF0C\u4E91\u5F71\u5C31\u5728\u4E91\u7684\u6B63\u4E0B\u65B9\uFF08uv\uFF1Akm\uFF09
float cloudShadow(vec2 uv) {
  if (uCloudCover < 0.01) return 1.0;
  float c = cloudField2(uv);
  float tau = c * uCloudThick * 9.0 * (1.0 + 2.0 * uCloudDark) + uStratus * uCloudCover * 3.0;
  return exp(-tau);
}

// \u4E91\u5C42\u4EE5\u4E0B\u7684\u7A7A\u6C14\u5E73\u5747\u53D7\u5149\u6BD4\u4F8B\uFF08\u955C\u5149\u88AB\u4E91\u6321\u6389\u7684\u90E8\u5206\uFF09
float underCloudLight(float hKm) {
  float shade = 1.0 - uCloudCover * (0.45 + 0.5 * uStratus) * (1.0 + uCloudDark) * 0.7;
  return mix(clamp(shade, 0.08, 1.0), 1.0, smoothstep(uCloudBase, uCloudBase + uCloudThick, hKm));
}
`;var du=`// ===== \u5929\u7A7A\u4E0E\u8FDC\u666F\uFF1A\u73AF\u5E26\u3001\u8FB9\u5899\u3001\u592A\u7A7A\u3001\u8F90\u6761\u3001\u661F\u6E2F\u3001\u955C\u4E91\u3001\u6052\u661F =====
// \u4F9D\u8D56\uFF1Acommon.glsl, atmos.glsl, ringmap.glsl\uFF08\u7531 TS \u62FC\u63A5\uFF09
uniform vec2 uTanHalf;    // (tan(\u6C34\u5E73\u534A\u89C6\u89D2), tan(\u7AD6\u76F4\u534A\u89C6\u89D2))
uniform mat4 uCamWorld;
uniform float uPixAng;     // \u6BCF\u50CF\u7D20\u5F27\u5EA6
uniform float uObsH;       // \u89C2\u5BDF\u8005\u9AD8\u51FA\u57FA\u51C6\u9762\uFF08km\uFF09
uniform mat3 uL2I;         // \u672C\u5730 \u2192 \u60EF\u6027
uniform float uSpin;       // \u81EA\u8F6C\u89D2 \u03A6\uFF08\u53D6\u6A21\uFF09
uniform float uTimeS;      // \u6A21\u62DF\u79D2\uFF08\u53D6\u6A21\uFF09
uniform vec2 uRes;
uniform sampler2D tSpace;  // \u955C\u7FA4\u70B9\u5C42
uniform float uHasSpace;
uniform float uEnvMode;    // 1 = \u6E32\u67D3\u7B49\u8DDD\u67F1\u72B6\u73AF\u5883\u56FE

// \u591C\u95F4\u706F\u5149\u7A79\u9876\uFF1Axy \u4E2D\u5FC3\uFF08km\uFF09\uFF0Cz \u534A\u5F84\uFF08km\uFF09\uFF0Cw \u5F3A\u5EA6
uniform vec4 uGlow[4];
uniform vec3 uGlowColor;

// \u955C\u4E91
uniform float uMirrorDay;   // 0..1 \u672C\u5730\u88AB\u7167\u4EAE\u7684\u7A0B\u5EA6\uFF08\u767D\u663C\u955C\u95EA\uFF09
uniform float uStarVisSky;  // \u89C2\u5BDF\u70B9\u5904\u6052\u661F\u9732\u51FA\u6BD4\u4F8B
uniform float uFarComp;
uniform vec3 uStarSpaceE;  // \u592A\u7A7A\u4E2D\u7684\u7269\u4F53\u603B\u80FD\u88AB\u6052\u661F\u7167\u5230     // \u591C\u91CC\u8FDC\u666F\u7684\u5C40\u90E8\u9002\u5E94\u538B\u7F29\uFF08\u2248 \u66DD\u5149 \xD7 \u7CFB\u6570\uFF09

in vec2 vNdc;

const float RT_WALL = RING_R - WALL_H;

// \u5149\u6C61\u67D3\uFF1A\u8FD1\u5730\u9762\u7684\u53D1\u5149
vec3 townGlow(vec3 p) {
  vec3 g = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    vec4 G = uGlow[i];
    if (G.w <= 0.0) continue;
    float r2 = sq(p.x - G.x) + sq(p.z - G.y);
    g += uGlowColor * G.w * exp(-r2 / sq(G.z));
  }
  return g;
}

// \u96E8\u67F1\uFF1A\u9635\u96E8\u4E91\u4E0B\u65B9\u7684\u7070\u8272\u96E8\u5E55\uFF08\u53EA\u7528\u5927\u5C3A\u5EA6\u5BF9\u6D41\u5355\u4F53\uFF0C\u5F00\u9500\u5C0F\uFF09
float rainShaft(vec3 p, float h) {
  if (uShowers < 0.01) return 0.0;
  if (h > uCloudBase) return 0.0;
  float cell = vnoise3p(vec3((p.x - uCloudOff.x) / 14.4, uCloudEvo * 0.5 + 91.0, (p.z - uCloudOff.y) / 14.4), 320.0);
  float base = vnoise3p(vec3((p.x - uCloudOff.x) / 3.2, uCloudEvo * 0.7, (p.z - uCloudOff.y) / 3.2), 1440.0);
  float c = cell * 0.55 + base * 0.45;
  return smoothstep(0.6, 0.8, c) * uShowers;
}

// \u5706\u67F1\uFF08\u534A\u5F84 r\uFF09\u4E0E\u5C04\u7EBF\u7684\u4EA4\u70B9\uFF1A\u8FD4\u56DE (s_near, s_far)\uFF0C\u65E0\u4EA4\u8FD4\u56DE (-1,-1)\u3002O \u5728\u5927\u5706\u67F1\u5185
vec2 cylHits(vec3 O, vec3 d, float r) {
  vec2 p = vec2(O.x, O.y - RING_R);
  float a = max(dot(d.xy, d.xy), 1e-12);
  float b = dot(p, d.xy);
  float c = dot(p, p) - r * r;
  float disc = b * b - a * c;
  if (disc <= 0.0) return vec2(-1.0);
  float q = sqrt(disc);
  if (c > 0.0) {
    if (b >= 0.0) return vec2(-1.0);
    return vec2(c / (-b + q), (-b + q) / a);
  }
  return vec2(-1.0, (b > 0.0) ? (-c) / (b + q) : (-b + q) / a);
}

float heightAt(vec3 P) { return RING_R - length(vec2(P.x, P.y - RING_R)); }
vec3 upAt(vec3 P) { return normalize(vec3(-P.x, RING_R - P.y, 0.0)); }

// ---------- \u8FD1\u5904\u5927\u6C14\u79EF\u5206\uFF08\u542B\u8FDC\u7AEF\u5BF9\u79F0\u534A\u6BB5\uFF09 ----------
struct AtmoOut {
  vec3 inNear;   // \u8FD1\u534A\u6BB5\u6563\u5C04
  vec3 Tnear;    // \u8FD1\u534A\u6BB5\u900F\u5C04\u7387
  vec3 inFar;    // \u8FDC\u534A\u6BB5\u6563\u5C04\uFF08\u5DF2\u4E58\u900F\u5C04\uFF09
  vec3 inCloud;  // \u5230\u4E91\u5C42\u5904\u7684\u6563\u5C04
  vec3 Tcloud;   // \u5230\u4E91\u5C42\u5904\u7684\u900F\u5C04\u7387
};

AtmoOut integrateAtmo(vec3 O, vec3 d, float sEnd, bool far, vec3 farE, vec3 farUp, float sCloud, int N) {
  AtmoOut r;
  vec3 tau = vec3(0.0);
  vec3 inN = vec3(0.0);
  vec3 inFr = vec3(0.0);
  r.inCloud = vec3(0.0);
  r.Tcloud = vec3(1.0);
  bool cloudDone = sCloud <= 0.0;
  float muF = dot(d, -farUp);
  float pRF = phaseR(muF);
  float pMF = phaseM(muF, uMieG);
  float muS = dot(d, uStarDir);
  float pRS = phaseR(muS);
  float pMS = phaseM(muS, uMieG);
  float invSinS = 1.0 / max(uStarDir.y + 0.015, 0.03);
  vec3 isoE = (uAmbSky + uArchE * 0.45) * 0.0795775;
  vec3 isoFar = farE * 0.22 * 0.0795775;
  float prev = 0.0;
  for (int i = 0; i < 16; i++) {
    if (i >= N) break;
    float t1 = float(i + 1) / float(N);
    float s1 = sEnd * t1 * t1;
    float ds = s1 - prev;
    float sm = prev + 0.5 * ds;
    vec3 P = O + d * sm;
    float h = max(heightAt(P), 0.0);
    float rR = exp(-h / HR);
    float rM = exp(-h / HM);
    float rain = rainShaft(P, h) * 0.9 + uRain * 0.35 * exp(-h / 1.2);
    vec3 sR = BR * rR;
    float sM = uMieK * rM;
    vec3 ext = sR + vec3(sM * 1.11 + rain * 0.6);
    vec3 dtau = ext * ds;
    vec3 tauMid = tau + 0.5 * dtau;
    vec3 Tm = exp(-tauMid);
    vec3 up = upAt(P);
    float mu = dot(d, up);
    vec3 Tsun = exp(-tauUp(h)) * underCloudLight(h);
    vec3 light = (sR * phaseR(mu) + sM * phaseM(mu, uMieG)) * uMirrorE * Tsun;
    light += (sR + vec3(sM + rain * 0.5)) * isoE;
    // \u6052\u661F\u5149\uFF08\u53EA\u7167\u4EAE\u5357\u5899\u9634\u5F71\u4E4B\u4E0A\u7684\u7A7A\u6C14\uFF09
    if (uStarE.r > 0.0) {
      float vis = starVisAt(P.z, h);
      if (vis > 0.0) {
        vec3 Ts = exp(-tauUp(h) * invSinS);
        light += (sR * pRS + sM * pMS) * uStarE * Ts * vis;
      }
    }
    // \u591C\u95F4\u57CE\u9547\u5149\u6655
    if (h < 2.0) light += townGlow(P) * (sR.g * 2.0 + sM * 3.0 + rain) * exp(-h / 0.35);
    inN += light * Tm * ds;
    if (far) {
      // \u8FDC\u7AEF\u5BF9\u79F0\u4F4D\u7F6E\uFF1A\u540C\u6837\u7684\u5BC6\u5EA6\uFF0C\u7528\u8FDC\u5904\u7684\u5149\u7167
      vec3 lf = (sR * pRF + sM * pMF) * farE * Tsun + (sR + vec3(sM)) * isoFar;
      inFr += lf * exp(min(tauMid, vec3(60.0))) * ds;
    }
    tau += dtau;
    if (!cloudDone && s1 >= sCloud) {
      // \u7EBF\u6027\u63D2\u503C\u5230\u4E91\u5C42\u5904
      float f = (sCloud - prev) / max(ds, 1e-6);
      vec3 tauC = tau - dtau * (1.0 - f);
      r.Tcloud = exp(-tauC);
      r.inCloud = inN - light * Tm * ds * (1.0 - f);
      cloudDone = true;
    }
    prev = s1;
  }
  r.Tnear = exp(-tau);
  r.inNear = inN;
  if (!cloudDone) {
    r.Tcloud = r.Tnear;
    r.inCloud = inN;
  }
  if (far) r.inFar = inFr * r.Tnear * r.Tnear;
  else r.inFar = vec3(0.0);
  return r;
}

// ---------- \u661F\u7A7A ----------
vec3 faceDir(float face, vec2 uv) {
  if (face < 0.5) return vec3(1.0, uv.x, uv.y);
  if (face < 1.5) return vec3(-1.0, uv.x, uv.y);
  if (face < 2.5) return vec3(uv.x, 1.0, uv.y);
  if (face < 3.5) return vec3(uv.x, -1.0, uv.y);
  if (face < 4.5) return vec3(uv.x, uv.y, 1.0);
  return vec3(uv.x, uv.y, -1.0);
}

vec3 starField(vec3 dI, float pix) {
  vec3 a = abs(dI);
  float face;
  vec2 uv;
  if (a.x >= a.y && a.x >= a.z) { face = dI.x > 0.0 ? 0.0 : 1.0; uv = dI.yz / a.x; }
  else if (a.y >= a.z) { face = dI.y > 0.0 ? 2.0 : 3.0; uv = dI.xz / a.y; }
  else { face = dI.z > 0.0 ? 4.0 : 5.0; uv = dI.xy / a.z; }
  vec3 col = vec3(0.0);
  for (int layer = 0; layer < 3; layer++) {
    float cells = layer == 0 ? 20.0 : (layer == 1 ? 48.0 : 110.0);
    float prob = layer == 0 ? 0.035 : (layer == 1 ? 0.12 : 0.26);
    vec2 g = (uv * 0.5 + 0.5) * cells;
    vec2 ci = floor(g);
    vec3 h = hash33(vec3(ci, face * 13.0 + float(layer) * 101.0 + 7.0));
    if (h.z < prob) {
      vec2 sp = ci + 0.2 + 0.6 * h.xy;
      vec3 sd = normalize(faceDir(face, sp / cells * 2.0 - 1.0));
      float ang = length(cross(sd, dI));
      float rpx = ang / pix;
      if (rpx < 3.0) {
        float hm = hash12(ci + face * 3.7 + float(layer) * 19.0);
        // \u8D8A\u6697\u7684\u661F\u8D8A\u591A
        float mag = layer == 0 ? mix(-0.8, 2.5, pow(hm, 0.6)) : (layer == 1 ? mix(2.5, 4.5, pow(hm, 0.7)) : mix(4.5, 7.0, pow(hm, 0.6)));
        float flux = pow(10.0, -0.4 * mag);
        float tcol = hash12(ci * 1.7 + face);
        vec3 c = tcol < 0.2 ? vec3(0.75, 0.85, 1.0) : (tcol < 0.75 ? vec3(1.0, 0.97, 0.92) : (tcol < 0.93 ? vec3(1.0, 0.85, 0.65) : vec3(1.0, 0.7, 0.5)));
        float psf = exp(-rpx * rpx * 1.6) * 0.55;
        col += c * flux * psf;
      }
    }
  }
  return col * 0.012;
}

vec3 milkyWay(vec3 dI) {
  vec3 n = normalize(vec3(0.38, -0.62, 0.69));
  float b = dot(dI, n);
  float band = exp(-b * b / (2.0 * 0.11 * 0.11));
  vec3 core = normalize(vec3(0.82, 0.52, 0.24));
  float bulge = exp(-sq(acos(clamp(dot(dI, core), -1.0, 1.0)) / 0.45));
  float clump = 0.55 + 0.45 * vnoise3(dI * 9.0) + 0.25 * vnoise3(dI * 23.0);
  float dust = smoothstep(0.35, 0.75, vnoise3(dI * 14.0 + 2.0)) * exp(-b * b / (2.0 * 0.035 * 0.035));
  float v = band * clump * (1.0 - 0.5 * dust) + bulge * 0.7;
  return vec3(0.9, 0.92, 1.0) * v * 0.00005;
}

// ---------- \u7EBF\u6BB5\uFF1A\u5C04\u7EBF\u4E0E\u4E09\u7EF4\u7EBF\u6BB5\u7684\u89D2\u8DDD\u79BB\u8986\u76D6 ----------
// \u8FD4\u56DE\u8986\u76D6\u7387\uFF08\u7C97\u7565\u6309\u7EBF\u5BBD halfW km\uFF09\u4EE5\u53CA\u6CBF\u5C04\u7EBF\u7684\u8DDD\u79BB sOut
float segCov(vec3 O, vec3 d, vec3 A, vec3 B, float halfW, out float sOut) {
  vec3 u = B - A;
  vec3 w0 = O - A;
  float a = dot(d, d), b = dot(d, u), c = dot(u, u), dd = dot(d, w0), e = dot(u, w0);
  float den = a * c - b * b;
  float sc = (b * e - c * dd) / max(den, 1e-9);
  float tc = (a * e - b * dd) / max(den, 1e-9);
  tc = clamp(tc, 0.0, 1.0);
  sc = dot(A + u * tc - O, d);
  sOut = sc;
  if (sc <= 0.0) return 0.0;
  float dist = length(O + d * sc - (A + u * tc));
  return lineCov(dist, halfW, 0.5 * sc * uPixAng);
}

// ---------- \u661F\u6E2F\uFF08\u73AF\u5FC3\uFF09 ----------
vec4 hubHit(vec3 O, vec3 d) {
  float rH = 120.0;
  float hl = 360.0;
  vec2 p = vec2(O.x, O.y - RING_R);
  float a = dot(d.xy, d.xy);
  float b = dot(p, d.xy);
  float c = dot(p, p) - rH * rH;
  float disc = b * b - a * c;
  if (disc <= 0.0) return vec4(-1.0);
  float s = c / (-b + sqrt(disc));
  vec3 P = O + d * s;
  if (abs(P.z) > hl) return vec4(-1.0);
  return vec4(P, s);
}

vec3 hubShade(vec3 P, vec3 d, float s) {
  vec3 n = normalize(vec3(P.x, P.y - RING_R, 0.0));
  float zz = P.z;
  float ang = atan(n.x, -n.y);
  // \u73AF\u5411\u5206\u6BB5\u3001\u5BF9\u63A5\u73AF\u4E0E\u8231\u677F
  float rings = smoothstep(0.82, 0.97, abs(sin(zz / 360.0 * PI * 6.0)));
  float panel = vnoise2(vec2(ang * 40.0, zz / 7.0));
  vec3 base = vec3(0.36, 0.37, 0.39) * (0.7 + 0.45 * panel) * (1.0 - rings * 0.35);
  // \u671D\u5411\u6211\u4EEC\u7684\u4E00\u9762\uFF1A\u88AB\u672C\u5730\u8FD9\u534A\u8FB9\u73AF\u7684\u5730\u9762\u7167\u4EAE\uFF08\u767D\u663C\u65F6\uFF09
  float ringshine = 0.14 * dayIntensity(uLocalHour) + 0.002;
  // \u80CC\u9762\uFF08\u671D\u5411\u5BF9\u5CB8\uFF09\u88AB\u5BF9\u5CB8\u7167\u4EAE\uFF0C\u4ECE\u6211\u4EEC\u8FD9\u8FB9\u53EA\u5728\u8F6E\u5ED3\u5904\u770B\u5230\u4E00\u9053\u4EAE\u8FB9
  float rim = pow(1.0 - abs(dot(n, -d)), 3.0);
  float farLit = 0.18 * dayIntensity(uLocalHour + 12.0);
  vec3 c = base * uDayE * (ringshine + farLit * rim * 2.5) / PI;
  c += base * uStarSpaceE * 0.004 / PI;
  // \u6E2F\u533A\u706F\u5149\uFF1A\u8231\u7A97\u4E0E\u5BF9\u63A5\u73AF
  float win = step(0.9, vnoise2(vec2(ang * 140.0, zz / 1.8))) * (0.5 + rings);
  float dock = rings * step(0.6, fract(ang * 6.0 + zz * 0.01));
  c += vec3(1.0, 0.86, 0.66) * (win * 0.0016 + dock * 0.0008) * (0.4 + 0.6 * (1.0 - dayRamp(uLocalHour)));
  float beacon = step(0.93, fract(uTimeS / 2.4)) * step(330.0, abs(zz));
  c += vec3(1.0, 0.25, 0.2) * beacon * 0.02;
  return c;
}

// ---------- \u8F90\u6761 ----------
// \u8F90\u6761\u4F4D\u4E8E z\u22480 \u7684\u5E73\u9762\u5185\uFF0C\u4ECE\u5730\u9762\u7ECF\u5EA6 \u03B8k \u76F4\u5230\u73AF\u5FC3
vec4 spokes(vec3 O, vec3 d, float sMax, out float sHit) {
  vec4 acc = vec4(0.0);
  sHit = 1e9;
  for (int k = 0; k < 6; k++) {
    float th = radians(-35.0 + 60.0 * float(k));
    vec2 nk = vec2(cos(th), sin(th));        // \u8F90\u6761\u6240\u5728\u5E73\u9762\u7684\u6CD5\u5411\uFF08\u5207\u5411\uFF09
    vec2 rk = vec2(sin(th), -cos(th));       // \u7531\u73AF\u5FC3\u6307\u5411\u843D\u70B9
    float den = dot(d.xy, nk);
    if (abs(den) < 1e-6) continue;
    float s = dot(vec2(0.0, RING_R) - O.xy, nk) / den;
    if (s <= 0.0 || s >= sMax) continue;
    vec3 P = O + d * s;
    vec2 q = P.xy - vec2(0.0, RING_R);
    float rho = dot(q, rk);
    if (rho <= 0.0 || rho > RING_R) continue;
    float t = rho / RING_R;
    float halfW = mix(8.0, 22.0, t * t) + 55.0 * exp(-(RING_R - rho) / 160.0);
    float cov = lineCov(abs(P.z), halfW, 0.5 * s * uPixAng);
    if (cov <= 0.0) continue;
    // \u7ED3\u6784\uFF1A\u7EB5\u5411\u6841\u67B6\u4E0E\u5347\u964D\u8231\u706F
    float truss = 0.6 + 0.4 * step(0.5, fract(rho / 900.0));
    vec3 base = vec3(0.42, 0.43, 0.45) * truss;
    // \u7167\u660E\uFF1A\u6052\u661F\uFF08\u63A0\u5C04\uFF09\u3001\u843D\u70B9\u9644\u8FD1\u88AB\u7167\u4EAE\u7684\u5730\u9762\uFF08\u8D8A\u9760\u8FD1\u5730\u9762\u8D8A\u4EAE\uFF09\u3001\u4EE5\u53CA\u6574\u6761\u73AF\u5E26\u7684\u53CD\u5149
    float hourK = uLocalHour + degrees(th) / 15.0;
    float baseLit = dayIntensity(hourK);
    float ringshine = mix(0.006, 0.09, t * t * t) * baseLit + uArchMax * 1.5;
    vec3 c = base * (uStarSpaceE * 0.006 + uDayE * ringshine) / PI;
    float car = fract(rho / 6000.0 - uTimeS / 5400.0 * (mod(float(k), 2.0) * 2.0 - 1.0));
    c += vec3(1.0, 0.9, 0.75) * smoothstep(0.985, 1.0, car) * 0.0012;
    c += vec3(0.9, 0.95, 1.0) * step(0.985, fract(rho / 1500.0)) * 0.00015;
    if (s < sHit) sHit = s;
    acc.rgb = mix(acc.rgb, c, cov);
    acc.a = max(acc.a, cov);
  }
  return acc;
}

// ---------- \u955C\u4E91\uFF1A\u672A\u5206\u8FA8\u7684\u6574\u4F53\u8F89\u5149 + \u9759\u6B62\u9AA8\u67B6 ----------
// \u955C\u7FA4\u9644\u7740\u5728\u9759\u6B62\u7684\u9AA8\u67B6\u4E0A\uFF1A\u7531\u82E5\u5E72\u540C\u8F74\u7684\u7A00\u758F\u300C\u5E55\u5C42\u300D\u7EC4\u6210\uFF0C\u8FB9\u7F18\u53C2\u5DEE\uFF0C\u5185\u90E8\u6210\u56E2
float mirrorEnv(vec3 cp, float rho, float az) {
  float warp = vnoise3(cp / 1800.0) - 0.5;
  float rIn = 3000.0 + 500.0 * warp;
  float rOut = 7000.0 - 700.0 * (vnoise3(cp / 2300.0 + 7.0) - 0.3);
  float zOut = 3750.0 - 900.0 * vnoise3(cp / 2600.0 + 3.0);
  return smoothstep(rIn, rIn + 600.0, rho) * smoothstep(rOut, rOut - 900.0, rho) * smoothstep(zOut, zOut - 700.0, az) * smoothstep(260.0, 510.0, az);
}
float mirrorDensity(vec3 P, float env) {
  vec2 q = P.xy - vec2(0.0, RING_R);
  float rho = length(q);
  float psi = atan(q.x, -q.y) + uSpin;
  vec3 cp = vec3(cos(psi) * rho, sin(psi) * rho, P.z);
  float shell = pow(abs(sin(rho / 1000.0 * PI)), 6.0);
  float flock = smoothstep(0.42, 0.72, vnoise3(cp / 1500.0) * 0.65 + vnoise3(cp / 640.0) * 0.35);
  float clump = vnoise3(cp / 260.0) * 0.65 + vnoise3(cp / 90.0) * 0.35;
  float c = smoothstep(0.3, 0.9, clump);
  return env * flock * (0.3 + 0.7 * shell) * (0.1 + 0.9 * c * c);
}

vec3 mirrorGlow(vec3 O, vec3 d, float sMax) {
  vec2 outer = cylHits(O, d, 7600.0);
  if (outer.x < 0.0) return vec3(0.0);
  vec2 inner = cylHits(O, d, 2500.0);
  float dens = 0.0;
  float segA0 = outer.x, segA1 = inner.x > 0.0 ? inner.x : outer.y;
  float segB0 = inner.x > 0.0 ? inner.y : 0.0, segB1 = inner.x > 0.0 ? outer.y : 0.0;
  for (int seg = 0; seg < 2; seg++) {
    float s0 = seg == 0 ? segA0 : segB0;
    float s1 = seg == 0 ? segA1 : segB1;
    s1 = min(s1, sMax);
    if (s1 <= s0) continue;
    // \u5305\u7EDC\u5728\u8BE5\u6BB5\u4E2D\u70B9\u7B97\u4E00\u6B21
    vec3 Pm = O + d * (0.5 * (s0 + s1));
    vec2 qm = Pm.xy - vec2(0.0, RING_R);
    float rhoM = length(qm);
    float psiM = atan(qm.x, -qm.y) + uSpin;
    float env = mirrorEnv(vec3(cos(psiM) * rhoM, sin(psiM) * rhoM, Pm.z), rhoM, abs(Pm.z));
    if (env <= 0.0) continue;
    for (int i = 0; i < 4; i++) {
      float s = mix(s0, s1, (float(i) + 0.5) / 4.0);
      dens += mirrorDensity(O + d * s, env) * (s1 - s0) / 4.0;
    }
  }
  // \u767D\u663C\uFF1A\u671D\u5411\u672C\u5730\u7684\u955C\u9762\u53CD\u5C04\u6052\u661F\u5149\uFF1B\u591C\u91CC\uFF1A\u661F\u5149\u7167\u4EAE\u7684\u6A21\u5757\u8FB9\u6846\uFF0C\u6DE1\u6DE1\u7684\u94F6\u7070
  vec3 dayC = uDayE * (uMirrorDay * 0.0006);
  vec3 nightC = vec3(0.78, 0.82, 0.9) * 9.0e-8 * (uStarSpaceE.x / 1.4);
  return dens * (dayC + nightC);
}

float frameLines(vec3 O, vec3 d) {
  float c = 0.0;
  float so;
  // \u8F74\u5411\u4E3B\u6881\uFF08\u9759\u6B62\uFF09\uFF1A\u73AF\u5FC3\u4E24\u4FA7\u5EF6\u4F38\u5230 \xB13750 km
  vec3 A = vec3(0.0, RING_R, 380.0);
  vec3 B = vec3(0.0, RING_R, 3800.0);
  c = max(c, segCov(O, d, A, B, 7.0, so));
  c = max(c, segCov(O, d, vec3(0.0, RING_R, -380.0), vec3(0.0, RING_R, -3800.0), 7.0, so));
  // \u5F84\u5411\u60AC\u81C2\uFF1A\u9759\u6B62\u4E8E\u60EF\u6027\u7CFB\uFF0C\u968F\u81EA\u8F6C\u5728\u6211\u4EEC\u770B\u6765\u7F13\u7F13\u8F6C\u52A8
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float zb = (mod(fi, 2.0) < 0.5 ? 1.0 : -1.0) * (700.0 + 1000.0 * floor(fi / 2.0));
    float psi = fi * 2.399 - uSpin;
    vec3 P0 = vec3(0.0, RING_R, zb);
    vec3 P1 = vec3(7300.0 * sin(psi), RING_R - 7300.0 * cos(psi), zb);
    c = max(c, segCov(O, d, P0, P1, 5.0, so) * 0.8);
  }
  // \u73AF\u5F62\u7B8D\uFF1A\u5728 z = \xB1zb \u5E73\u9762\u4E0A\u534A\u5F84 7300 km \u7684\u5706
  for (int j = 0; j < 4; j++) {
    float zb = (j < 2 ? 1.0 : -1.0) * (j == 0 || j == 2 ? 1700.0 : 3700.0);
    if (abs(d.z) < 1e-5) continue;
    float s = (zb - O.z) / d.z;
    if (s <= 0.0) continue;
    vec3 P = O + d * s;
    float rho = length(P.xy - vec2(0.0, RING_R));
    float dist = abs(rho - 7300.0) * abs(d.z);
    c = max(c, lineCov(dist, 5.0, 0.5 * s * uPixAng) * 0.7);
  }
  return c;
}

// ---------- \u8FB9\u5899\u5185\u58C1 ----------
vec3 wallShade(vec3 P, vec3 d, float s, float hourLoc) {
  float h = heightAt(P);
  float th = atan(P.x, RING_R - P.y);
  float u = th * RING_R;
  // \u7AD6\u5411\u6276\u58C1\u4E0E\u6C34\u5E73\u68C0\u4FEE\u5C42
  float fpk = s * uPixAng;  // \u50CF\u7D20\u8DB3\u8FF9\uFF08km\uFF09
  float rib = smoothstep(0.82, 1.0, abs(sin(u / 22.0 * PI))) * (1.0 - smoothstep(2.0, 8.0, fpk));
  float tier = smoothstep(0.9, 1.0, abs(sin(h / 6.25 * PI))) * (1.0 - smoothstep(0.3, 1.2, fpk / max(abs(d.y), 0.02)));
  float n = vnoise2(vec2(u / 4.0, h / 2.0));
  vec3 alb = vec3(0.28, 0.29, 0.31) * (0.85 + 0.2 * n) * (1.0 - 0.12 * rib) * (1.0 + 0.1 * tier);
  float di = dayIntensity(hourLoc);
  vec3 E = uDayE * mirrorTint(hourLoc) * di;
  vec3 En = vec3(0.75, 0.82, 1.0) * uArchMax * dayIntensity(hourLoc + 12.0);
  // \u5782\u76F4\u58C1\u9762\u53EA\u53D7\u63A0\u5C04\u955C\u5149\uFF0C\u4E3B\u8981\u9760\u5730\u9762\u53CD\u5149\u548C\u5929\u5149
  vec3 c = alb * (E * (0.12 + 0.2 * smoothstep(WALL_H - 2.0, WALL_H, h)) + En * 0.15) / PI;
  // \u591C\u706F\uFF1A\u53EA\u5728\u4E09\u5C42\u68C0\u4FEE\u5ECA\u9053\u4E0A\uFF0C\u7A00\u758F\u6210\u70B9\uFF1B\u8FDC\u5904\u6309\u50CF\u7D20\u8DB3\u8FF9\u53D6\u5E73\u5747
  float lvl = abs(h - 12.5) < 0.25 || abs(h - 25.0) < 0.25 || abs(h - 37.5) < 0.25 ? 1.0 : 0.0;
  float dots = step(0.82, hash12(vec2(floor(u / 0.8), floor(h))));
  float lights = lvl * dots * (1.0 - dayRamp(hourLoc));
  c += vec3(1.0, 0.82, 0.6) * lights * 0.00035;
  // \u5899\u9876\u822A\u6807
  c += vec3(1.0, 0.3, 0.25) * smoothstep(WALL_H - 0.6, WALL_H, h) * step(0.94, fract(uTimeS / 3.0 + u / 40.0)) * 0.006;
  return c;
}

void main() {
  vec3 d;
  if (uEnvMode > 0.5) {
    vec2 uv = vNdc * 0.5 + 0.5;
    float lon = (uv.x - 0.5) * TAU;
    float lat = (uv.y - 0.5) * PI;
    d = vec3(cos(lat) * sin(lon), sin(lat), -cos(lat) * cos(lon));
  } else {
    vec3 dv = normalize(vec3(vNdc.x * uTanHalf.x, vNdc.y * uTanHalf.y, -1.0));
    d = normalize(mat3(uCamWorld) * dv);
  }
  bool env = uEnvMode > 0.5;
  float pix = env ? 0.03 : uPixAng;
  vec3 O = vec3(0.0, uObsH, 0.0);

  // ---------- \u51E0\u4F55\u5206\u7C7B ----------
  vec2 hF = cylHits(O, d, RING_R);
  float sF = hF.y;
  float zF = O.z + sF * d.z;
  vec2 hT = cylHits(O, d, RT_WALL);
  bool hasT = hT.x > 0.0;
  float s1 = hT.x, s2 = hT.y;
  float sZ = abs(d.z) > 1e-7 ? (HALF_W - abs(O.z) * sign(d.z) * sign(O.z)) / abs(d.z) : 1e9;

  float covFloor = sat(0.5 + (HALF_W - abs(zF)) / (sF * pix));
  float covWall = 1.0;
  if (hasT) {
    float cn = sat(0.5 + (abs(s1 * d.z) - HALF_W) / (s1 * pix));
    float cf = s2 < sF ? sat(0.5 + (HALF_W - abs(s2 * d.z)) / (s2 * pix)) : 0.0;
    covWall = max(cn, cf);
  }
  float wFloor = covFloor;
  float wWall = (1.0 - covFloor) * covWall;
  float wSpace = (1.0 - covFloor) * (1.0 - covWall);

  // \u79EF\u5206\u7EC8\u70B9
  vec2 hA = cylHits(O, d, RING_R - 90.0);
  float sAtm = hA.x > 0.0 ? hA.x : 1e9;
  bool floorMain = wFloor >= max(wWall, wSpace);
  float sEnd;
  if (floorMain) sEnd = min(sF * 0.5, sAtm);
  else if (wWall >= wSpace) sEnd = min(sZ, sF);
  else sEnd = min(sAtm, sZ);
  sEnd = max(sEnd, 0.01);

  // \u8FDC\u5904\u5730\u9762\u4FE1\u606F\uFF08\u7528\u4E8E\u8FDC\u534A\u6BB5\u5927\u6C14\uFF09
  vec3 Pf = O + d * sF;
  float thF = atan(Pf.x, RING_R - Pf.y);
  float hourF = uLocalHour + thF / TAU * 24.0;
  vec3 farUp = upAt(Pf);
  vec3 farE = uDayE * mirrorTint(hourF) * dayIntensity(hourF) + vec3(0.75, 0.82, 1.0) * uArchMax * dayIntensity(hourF + 12.0);

  // ---------- \u672C\u5730\u4E91\u5C42 ----------
  float cloudA = 0.0;
  vec3 cloudL = vec3(0.0);
  float sCloud = -1.0;
  if (uCloudCover > 0.005 || uHighCloud > 0.005) {
    vec2 cb = cylHits(O, d, RING_R - uCloudBase);
    if (cb.x > 0.0 && cb.x < 700.0 && cb.x < sF) {
      vec2 ct = cylHits(O, d, RING_R - uCloudBase - uCloudThick);
      float sA = cb.x;
      float sB = ct.x > 0.0 ? ct.x : min(cb.y, sA + 40.0);
      sB = min(sB, sA + 60.0);
      sCloud = sA;
      float T = 1.0;
      // \u4E91\u5F53\u4F5C\u9AD8\u5EA6\u573A\uFF1A\u6BCF\u4E2A\u4F4D\u7F6E\u7684\u4E91\u9876\u9AD8\u5EA6\u7531\u8986\u76D6\u5EA6\u51B3\u5B9A\uFF08\u79EF\u4E91\u6210\u7A79\u9876\uFF0C\u5C42\u4E91\u5E73\u6574\uFF09\u3002
      // \u5148\u7C97\u6B65\u627E\u5230\u89C6\u7EBF\u7B2C\u4E00\u6B21\u8FDB\u5165\u4E91\u4F53\u7684\u4F4D\u7F6E\uFF0C\u518D\u4E8C\u5206\u7EC6\u5316\uFF0C\u5F97\u5230\u6E05\u6670\u7684\u4E91\u8FB9\u3002
      const int K = 12;
      float prevS = sA;
      float hitS = -1.0;
      float hitCov = 0.0;
      bool prevIn = false;
      for (int i = 0; i <= K; i++) {
        float sc = mix(sA, sB, pow(float(i) / float(K), 1.3));
        vec3 P = O + d * sc;
        float h = heightAt(P);
        float cov = cloudField2(vec2(P.x, P.z));
        float top = uCloudBase + uCloudThick * mix(pow(cov, 0.6), smoothstep(0.0, 0.3, cov), uStratus);
        bool inside = cov > 0.02 && h <= top + 0.001;
        if (inside) {
          if (i == 0) { hitS = sc; hitCov = cov; break; }
          // \u4E8C\u5206\u7EC6\u5316
          float a = prevS, b = sc;
          for (int j = 0; j < 5; j++) {
            float m = 0.5 * (a + b);
            vec3 Pm = O + d * m;
            float cm = cloudField2(vec2(Pm.x, Pm.z));
            float tm = uCloudBase + uCloudThick * mix(pow(cm, 0.6), smoothstep(0.0, 0.3, cm), uStratus);
            if (cm > 0.02 && heightAt(Pm) <= tm) { b = m; hitCov = cm; } else a = m;
          }
          hitS = b;
          if (hitCov <= 0.0) hitCov = cov;
          break;
        }
        prevS = sc;
      }
      if (hitS > 0.0) {
        vec3 P = O + d * hitS;
        float h = heightAt(P);
        float cov = hitCov;
        float top = uCloudBase + uCloudThick * mix(pow(cov, 0.6), smoothstep(0.0, 0.3, cov), uStratus);
        float hf = sat((h - uCloudBase) / max(top - uCloudBase, 0.02));
        // \u7A7F\u5165\u4E91\u4F53\u7684\u8DEF\u5F84\u957F\u5EA6\uFF08\u4F30\u8BA1\uFF09\uFF1A\u8584\u7684\u4E91\u8FB9\u534A\u900F\u660E
        float depth = max(top - uCloudBase, 0.01);
        float pathIn = min(depth / max(abs(d.y), 0.08), 3.0);
        float detail = 0.7 + 0.6 * vnoise3(vec3(P.x - uCloudOff.x, h * 2.0, P.z - uCloudOff.y) * 2.2 + uCloudEvo * 0.3);
        float tauV = 40.0 * cov * pathIn * detail;
        float a = 1.0 - exp(-tauV);
        float above = max(top - h, 0.0) * (cov * 34.0 + 6.0);
        float Tdiff = 1.0 / (1.0 + 0.1 * above * (1.0 + uCloudDark * 3.0));
        float mu = dot(d, upAt(P));
        float silver = exp(-above * 0.5) * phaseM(mu, 0.7) * 2.5 * (1.0 - smoothstep(0.1, 0.6, cov));
        vec3 Lc = uMirrorE * (Tdiff / PI * (0.75 + 0.5 * detail) + silver * 0.15) + (uAmbSky * 0.5 + uArchE) * Tdiff * 0.35;
        Lc += uMirrorE * 0.05 * (1.0 - hf) * vec3(0.8, 0.9, 0.75) / PI; // \u5730\u9762\u53CD\u5149
        // \u6052\u661F\u659C\u5149\u7167\u4EAE\u4E91\u7684\u4FA7\u9762\u4E0E\u5E95\u90E8
        float vis = starVisAt(P.z, h);
        if (vis > 0.0) {
          float muS = dot(d, uStarDir);
          vec3 Ts = exp(-tauUp(h) / max(uStarDir.y + 0.015, 0.03));
          Lc += uStarE * Ts * vis * (0.12 + phaseM(muS, 0.6) * 0.6) * (0.4 + 0.6 * hf);
        }
        Lc += townGlow(vec3(P.x, 0.0, P.z)) * 2.2 * (1.0 - hf);
        Lc *= 1.0 - uCloudDark * 0.55 * smoothstep(0.4, 1.0, cov);
        cloudL = Lc * a;
        T = 1.0 - a;
        sCloud = hitS;
      }
      cloudA = 1.0 - T;
      if (cloudA > 0.0) cloudL /= max(cloudA, 1e-4);
      // \u8FDC\u5904\u6DE1\u51FA
      float fade = 1.0 - smoothstep(250.0, 650.0, sA);
      cloudA *= fade;
    }
  }

  int N = env ? 8 : 12;
  AtmoOut at = integrateAtmo(O, d, sEnd, floorMain, farE, farUp, -1.0, N);
  // \u4E91\u524D\u65B9\u7684\u7A7A\u6C14\u5355\u72EC\u79EF\u5206\uFF0C\u907F\u514D\u4E0E\u73AF\u5E26\u5185\u5916\u4E0D\u540C\u7684\u91C7\u6837\u5206\u5E03\u4EA7\u751F\u63A5\u7F1D
  if (cloudA > 0.0) {
    AtmoOut ac = integrateAtmo(O, d, min(sCloud, sEnd), false, farE, farUp, -1.0, env ? 4 : 6);
    at.inCloud = ac.inNear;
    at.Tcloud = ac.Tnear;
  }

  // ---------- \u8FDC\u7AEF\u989C\u8272 ----------
  vec3 colFloor = vec3(0.0), colWall = vec3(0.0), colSpace = vec3(0.0);
  vec3 Tfar = at.Tnear; // \u8FDC\u534A\u6BB5\u4E0E\u8FD1\u534A\u6BB5\u5BF9\u79F0
  if (wFloor > 0.0) {
    float graze = max(dot(d, -farUp), 0.0);
    float fp = sF * pix / max(sqrt(graze), 0.08);
    float totT = luma(at.Tnear * Tfar);
    vec3 surf;
    if (totT > 0.004) {
      FarInfo fi = farSurface(thF, zF, fp, hourF, graze);
      surf = fi.rad;
    } else {
      surf = vec3(0.06, 0.07, 0.05) * farE / PI;
    }
    // \u6625\u7167\u3001\u79CB\u7167\u65F6\uFF0C\u5357\u5899\u9634\u5F71\u4EE5\u5317\u7684\u5927\u5730\u88AB\u4F4E\u659C\u7684\u6052\u661F\u5149\u7167\u4EAE
    if (uStarE.r > 0.0 && sF < 3000.0) {
      float vis = starVisAt(zF, 0.0);
      if (vis > 0.0) {
        vec3 Ts = exp(-tauUp(0.0) / max(uStarDir.y + 0.015, 0.03));
        surf += vec3(0.16, 0.15, 0.1) * uStarE * Ts * vis * max(uStarDir.y, 0.0) * 3.0 / PI;
      }
    }
    colFloor = at.inFar + Tfar * at.Tnear * surf;
    colFloor /= max(at.Tnear, vec3(1e-6)); // \u4E0B\u9762\u7EDF\u4E00\u4E58\u8FD1\u534A\u6BB5\u900F\u5C04\u7387\uFF0C\u8FD9\u91CC\u5148\u9664\u56DE\u53BB
  }
  if (wWall > 0.0) {
    vec3 Pw = O + d * min(sZ, sF);
    float thW = atan(Pw.x, RING_R - Pw.y);
    colWall = wallShade(Pw, d, sZ, uLocalHour + thW / TAU * 24.0);
  }
  if (wSpace > 0.0) {
    vec3 dI = uL2I * d;
    colSpace = env ? milkyWay(dI) * 1.0 : starField(dI, pix) + milkyWay(dI);
  }
  vec3 far = wFloor * colFloor + wWall * colWall + wSpace * colSpace;

  // ---------- \u592A\u7A7A\u7269\u4F53\uFF08\u5728\u8FDC\u5904\u5730\u9762\u4E0E\u672C\u5730\u5927\u6C14\u4E4B\u95F4\uFF09 ----------
  if (!env && d.y > 0.0) {
    float sLim = wFloor > 0.5 ? sF : 1e9;
    if (d.y > 0.94) {
      // \u955C\u4E91\u8F89\u5149
      far += mirrorGlow(O, d, sLim);
      // \u955C\u7FA4\u70B9\u5C42
      if (uHasSpace > 0.5) far += texture(tSpace, gl_FragCoord.xy / uRes).rgb;
      // \u9759\u6B62\u9AA8\u67B6
      float fl = frameLines(O, d);
      far = mix(far, vec3(0.3, 0.31, 0.33) * (uArchE * 2.5 + uStarSpaceE * 0.004 + uMirrorE * 0.0012) / PI, fl * 0.85);
    }
    // \u8F90\u6761
    if (abs(d.z) < 0.02) {
      float sSp;
      vec4 sp = spokes(O, d, sLim, sSp);
      far = mix(far, sp.rgb, sp.a);
    }
    // \u661F\u6E2F
    if (d.y > 0.995) {
      vec4 hb = hubHit(O, d);
      if (hb.w > 0.0 && hb.w < sLim) far = hubShade(hb.xyz, d, hb.w);
    }
  }

  // \u773C\u775B\u5BF9\u660E\u4EAE\u5BF9\u5CB8\u7684\u5C40\u90E8\u9002\u5E94\uFF1A\u591C\u91CC\u628A\u8FDC\u666F\u7684\u9AD8\u4EAE\u538B\u4E00\u538B\uFF0C\u4FDD\u7559\u7EC6\u8282
  far = far / (1.0 + luma(far) * uFarComp);
  vec3 col = at.inNear + at.Tnear * far;

  // ---------- \u6052\u661F\uFF08\u8D85\u91C7\u6837\uFF0C\u5904\u7406\u4E9A\u50CF\u7D20\u7684\u9732\u51FA\u7EC6\u7EBF\uFF09 ----------
  if (!env && uStarE.r > 0.0) {
    float ang = length(cross(d, uStarDir));
    if (dot(d, uStarDir) > 0.0 && ang < uStarAlpha + 4.0 * pix) {
      vec3 right = normalize(cross(d, vec3(0.0, 1.0, 0.0)));
      vec3 upv = cross(right, d);
      float acc = 0.0;
      // \u5148\u5224\u65AD\u50CF\u7D20\u4E2D\u5FC3\uFF1A\u8FDC\u79BB\u5899\u9876\u4E0E\u661F\u76D8\u8FB9\u7F18\u65F6\u53EA\u53D6\u4E00\u4E2A\u6837\u672C
      float sW = HALF_W / max(abs(d.z), 1e-6);
      float clr = (heightAt(O + d * sW) - WALL_H) / sW;
      bool simple = abs(clr) > 3.0 * pix && ang < uStarAlpha - 3.0 * pix;
      if (simple) {
        if (clr > 0.0) {
          float mu = sqrt(max(0.0, 1.0 - sq(ang / uStarAlpha)));
          acc = (1.0 - 0.6 * (1.0 - mu)) * 36.0;
        }
      } else {
        for (int i = 0; i < 6; i++) {
          for (int j = 0; j < 6; j++) {
            vec2 o = (vec2(float(i), float(j)) + 0.5) / 6.0 - 0.5;
            vec3 ds = normalize(d + (right * o.x + upv * o.y) * pix);
            float a2 = length(cross(ds, uStarDir));
            if (a2 > uStarAlpha) continue;
            // \u5899\u9876\u906E\u6321\u6D4B\u8BD5
            vec2 hh = cylHits(O, ds, RT_WALL);
            bool vis = hh.x > 0.0 && abs(hh.x * ds.z) < HALF_W;
            if (!vis) continue;
            float mu = sqrt(max(0.0, 1.0 - sq(a2 / uStarAlpha)));
            acc += 1.0 - 0.6 * (1.0 - mu);
          }
        }
      }
      acc /= 36.0;
      if (acc > 0.0) {
        float omega = PI * uStarAlpha * uStarAlpha;
        vec3 Lstar = uStarE / omega / 0.8;
        col += at.Tnear * Lstar * acc;
      }
    }
  }

  // \u4E91\u53E0\u52A0\uFF08\u4E91\u4E0E\u5176\u524D\u65B9\u7684\u7A7A\u6C14\uFF09
  if (cloudA > 0.0) {
    vec3 cloudCol = at.inCloud + at.Tcloud * cloudL;
    col = mix(col, cloudCol, cloudA);
  }

  // \u9AD8\u4E91\uFF08\u5377\u4E91\uFF09\uFF1A\u8584\u800C\u4EAE\u7684\u4E1D\u7F15
  if (uHighCloud > 0.01 && d.y > 0.02) {
    vec2 hc = cylHits(O, d, RING_R - 8.5);
    if (hc.x > 0.0 && hc.x < 400.0) {
      vec3 P = O + d * hc.x;
      vec2 q = vec2(P.x - uCloudOff.x * 1.6, P.z - uCloudOff.y * 1.6);
      q += vec2(vnoise2(q * 0.05), vnoise2(q * 0.05 + 7.0)) * 14.0;
      float n = vnoise2(q * vec2(0.09, 0.3)) * 0.55 + vnoise2(q * vec2(0.3, 0.8)) * 0.3 + vnoise2(q * 1.4) * 0.15;
      float ci = smoothstep(0.58, 0.9, n) * uHighCloud * (1.0 - smoothstep(120.0, 380.0, hc.x));
      ci *= 0.22 * (1.0 - cloudA);
      vec3 Lci = uMirrorE * (0.12 + phaseM(dot(d, vec3(0, 1, 0)), 0.75) * 0.2) + uArchE * 0.3;
      float vis = starVisAt(P.z, 8.5);
      Lci += uStarE * vis * 0.25 * exp(-tauUp(8.5) / max(uStarDir.y + 0.015, 0.03));
      col = mix(col, Lci * 0.9 + at.inCloud * 0.2, ci);
    }
  }

  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
}
`;var ce={uMieK:{value:.004},uMieG:{value:.74},uRainExt:{value:0},uDayE:{value:new D(1,.965,.925)},uMirrorE:{value:new D},uMirrorDir:{value:new D(0,1,0)},uArchE:{value:new D},uArchDir:{value:new D(0,1,0)},uArchMax:{value:.0012},uStarDir:{value:new D(0,.1,1).normalize()},uStarE:{value:new D},uStarAlpha:{value:.00465},uStarGround:{value:new D},uStarMargin0:{value:-1},uAmbSky:{value:new D},uLocalHour:{value:12},uSeasonA:{value:new Je(1,0,0,0)},uSeasonB:{value:new Je(0,0,0,0)},uFarTime:{value:0},uFarCloudBias:{value:0},uL2I:{value:new Ye},uSpin:{value:0},uTimeS:{value:0},uObsH:{value:.0017},uMirrorDay:{value:1},uStarVisSky:{value:0},uFarComp:{value:0},uStarSpaceE:{value:new D(1.4,1.34,1.26)},uCloudCover:{value:.2},uCloudBase:{value:1.6},uCloudThick:{value:1},uCloudDark:{value:0},uStratus:{value:0},uShowers:{value:0},uHighCloud:{value:.3},uCloudOff:{value:new Xe},uCloudEvo:{value:0},uRain:{value:0},uFogNow:{value:0},uFogTop:{value:60},uWet:{value:0},uWind:{value:new Xe(1,0)},uGlow:{value:[new Je,new Je,new Je,new Je]},uGlowColor:{value:new D(1,.62,.32)},uNight:{value:0},uTanHalf:{value:new Xe(1,1)},uPixAng:{value:.001},uRes:{value:new Xe(1,1)},uCamPosK:{value:new D(0,.0017,0)},tEnv:{value:null},tSpace:{value:null},uHasSpace:{value:0}};function gi(){let i=new lt;return i.setAttribute("position",new Ct([-1,-1,0,3,-1,0,-1,3,0],3)),i}var $g=`
uniform float uDepthZ;
out vec2 vNdc;
void main() {
  vNdc = position.xy;
  gl_Position = vec4(position.xy, uDepthZ, 1.0);
}
`;function sc(i){return new Ge({vertexShader:$g,fragmentShader:bt+`
`+xo+`
`+_o+`
`+fu+`
`+du,uniforms:{...ce,uCamWorld:{value:null},uEnvMode:{value:i?1:0},uDepthZ:{value:1}},depthWrite:!1,depthTest:!i})}function pu(i){let e=new We(gi(),i);return e.frustumCulled=!1,e.renderOrder=1e3,e}var rc=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Jg=`
uniform sampler2D tSrc;
uniform vec2 uTexel;
uniform float uFirst;
in vec2 vUv;
vec3 tap(vec2 o) { return texture(tSrc, vUv + o * uTexel).rgb; }
float kw(vec3 c) { return 1.0 / (1.0 + dot(c, vec3(0.2126, 0.7152, 0.0722))); }
void main() {
  vec3 a = tap(vec2(-2, 2)), b = tap(vec2(0, 2)), c = tap(vec2(2, 2));
  vec3 d = tap(vec2(-2, 0)), e = tap(vec2(0, 0)), f = tap(vec2(2, 0));
  vec3 g = tap(vec2(-2, -2)), h = tap(vec2(0, -2)), i = tap(vec2(2, -2));
  vec3 j = tap(vec2(-1, 1)), k = tap(vec2(1, 1)), l = tap(vec2(-1, -1)), m = tap(vec2(1, -1));
  vec3 col;
  if (uFirst > 0.5) {
    // Karis \u5E73\u5747\uFF0C\u6291\u5236\u6781\u4EAE\u5C0F\u70B9\u9020\u6210\u7684\u95EA\u70C1
    vec3 g0 = (a + b + d + e) * 0.25, g1 = (b + c + e + f) * 0.25, g2 = (d + e + g + h) * 0.25, g3 = (e + f + h + i) * 0.25, g4 = (j + k + l + m) * 0.25;
    float w0 = kw(g0), w1 = kw(g1), w2 = kw(g2), w3 = kw(g3), w4 = kw(g4);
    col = (g0 * w0 * 0.125 + g1 * w1 * 0.125 + g2 * w2 * 0.125 + g3 * w3 * 0.125 + g4 * w4 * 0.5) / (w0 * 0.125 + w1 * 0.125 + w2 * 0.125 + w3 * 0.125 + w4 * 0.5);
  } else {
    col = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  }
  gl_FragColor = vec4(min(col, vec3(6.0e4)), 1.0);
}
`,jg=`
uniform sampler2D tSrc;
uniform vec2 uTexel;
uniform float uWeight;
in vec2 vUv;
void main() {
  vec2 t = uTexel;
  vec3 s = texture(tSrc, vUv).rgb * 4.0;
  s += (texture(tSrc, vUv + vec2(-t.x, 0)).rgb + texture(tSrc, vUv + vec2(t.x, 0)).rgb + texture(tSrc, vUv + vec2(0, -t.y)).rgb + texture(tSrc, vUv + vec2(0, t.y)).rgb) * 2.0;
  s += texture(tSrc, vUv + vec2(-t.x, -t.y)).rgb + texture(tSrc, vUv + vec2(t.x, -t.y)).rgb + texture(tSrc, vUv + vec2(-t.x, t.y)).rgb + texture(tSrc, vUv + vec2(t.x, t.y)).rgb;
  gl_FragColor = vec4(s / 16.0 * uWeight, 1.0);
}
`,Qg=`
uniform sampler2D tHdr;
uniform sampler2D tBloom;
uniform sampler2D tLocal;
uniform float uExposure;
uniform float uBloom;
uniform float uLocalAmt;
uniform float uNightVis;
uniform float uGrain;
uniform float uTime;
uniform vec2 uRes;
uniform vec3 uGlarePos;   // \u5C4F\u5E55\u5750\u6807 xy\uFF080\u20131\uFF09\uFF0Cz = \u5F3A\u5EA6
uniform float uGlareAspect;
uniform float uFade;
in vec2 vUv;

// AgX\uFF08Troy Sobotka \u65B9\u6848\u7684\u62DF\u5408\u5B9E\u73B0\uFF09
vec3 agxContrast(vec3 x) {
  vec3 x2 = x * x;
  vec3 x4 = x2 * x2;
  return 15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4 - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 0.00232;
}
vec3 agx(vec3 c) {
  const mat3 inMat = mat3(0.842479062253094, 0.0423282422610123, 0.0423756549057051,
                          0.0784335999999992, 0.878468636469772, 0.0784336,
                          0.0792237451477643, 0.0791661274605434, 0.879142973793104);
  const mat3 outMat = mat3(1.19687900512017, -0.0528968517574562, -0.0529716355144438,
                           -0.0980208811401368, 1.15190312990417, -0.0980434501171241,
                           -0.0990297440797205, -0.0989611768448433, 1.15107367264116);
  const float minEv = -12.47393;
  const float maxEv = 4.026069;
  c = inMat * c;
  c = clamp(log2(max(c, vec3(1e-10))), minEv, maxEv);
  c = (c - minEv) / (maxEv - minEv);
  c = agxContrast(c);
  // \u7565\u52A0\u9971\u548C\u4E0E\u5BF9\u6BD4\uFF0C\u907F\u514D\u8FC7\u7070
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = l + (c - l) * 1.12;
  c = outMat * c;
  c = pow(max(c, vec3(0.0)), vec3(2.2));
  return c;
}

float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

void main() {
  vec3 hdr = texture(tHdr, vUv).rgb;
  vec3 bloom = texture(tBloom, vUv).rgb;
  vec3 c = hdr + bloom * uBloom;
  // \u5C40\u90E8\u66DD\u5149\uFF1A\u53EA\u538B\u6697\u660E\u663E\u8FC7\u4EAE\u7684\u533A\u57DF\uFF08\u591C\u91CC\u660E\u4EAE\u7684\u5BF9\u5CB8\u3001\u767D\u5929\u7684\u955C\u4E91\uFF09
  float Lloc = dot(texture(tLocal, vUv).rgb, vec3(0.2126, 0.7152, 0.0722));
  float ref = 0.5 / uExposure;
  float f = pow(max(Lloc / ref, 1.0), -uLocalAmt);
  // \u53EA\u538B\u6697\u672C\u8EAB\u5C31\u4EAE\u7684\u50CF\u7D20\uFF0C\u907F\u514D\u5728\u4EAE\u7269\u4F53\u5468\u56F4\u7559\u4E0B\u6697\u6655
  float Lpix = dot(hdr, vec3(0.2126, 0.7152, 0.0722));
  f = mix(1.0, f, smoothstep(0.25, 1.2, Lpix / max(Lloc, 1e-9)));
  c *= uExposure * clamp(f, 0.03, 1.0);
  // \u6052\u661F\u7729\u5149
  if (uGlarePos.z > 0.0) {
    vec2 dp = (vUv - uGlarePos.xy) * vec2(uGlareAspect, 1.0);
    float r = length(dp);
    float halo = uGlarePos.z * (0.02 / (r * r * 400.0 + 1.0) + 0.004 / (r * 30.0 + 0.4));
    float ang = atan(dp.y, dp.x);
    float spikes = pow(abs(cos(ang * 3.0)), 60.0) * exp(-r * 18.0) * uGlarePos.z * 0.15;
    c += vec3(1.0, 0.82, 0.6) * (halo + spikes);
  }
  // \u6697\u89C6\u89C9\uFF1A\u6781\u6697\u65F6\u504F\u84DD\u3001\u53BB\u9971\u548C
  float L = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float scot = uNightVis * (1.0 - smoothstep(0.02, 0.35, L));
  c = mix(c, vec3(L) * vec3(0.78, 0.9, 1.15), scot * 0.55);
  vec3 o = agx(c);
  // \u514B\u5236\u7684\u8C03\u8272\uFF1A\u9AD8\u5149\u7565\u6696\uFF0C\u9634\u5F71\u7565\u9752
  float lo = dot(o, vec3(0.2126, 0.7152, 0.0722));
  o = mix(o, o * vec3(0.97, 1.0, 1.03), (1.0 - lo) * 0.25);
  // \u6697\u89D2
  vec2 q = vUv - 0.5;
  o *= 1.0 - dot(q, q) * 0.32;
  o *= uFade;
  // \u8F93\u51FA sRGB
  o = pow(max(o, vec3(0.0)), vec3(1.0 / 2.2));
  // \u9897\u7C92\u4E0E\u6296\u52A8
  float n = hash(vUv * uRes + fract(uTime) * 917.0) - 0.5;
  o += n * (uGrain + 1.0 / 255.0);
  gl_FragColor = vec4(o, 1.0);
}
`,yo=class{constructor(){this.scene=new Zt;this.cam=new cn(-1,1,1,-1,0,1);this.levels=[];this.localRT=null;this.w=0;this.h=0;this.down=new Ge({vertexShader:rc,fragmentShader:Jg,uniforms:{tSrc:{value:null},uTexel:{value:new Xe},uFirst:{value:0}},depthTest:!1,depthWrite:!1,blending:hn}),this.up=new Ge({vertexShader:rc,fragmentShader:jg,uniforms:{tSrc:{value:null},uTexel:{value:new Xe},uWeight:{value:1}},depthTest:!1,depthWrite:!1,blending:ya,blendEquation:Tn,blendSrc:Ys,blendDst:Ys}),this.composite=new Ge({vertexShader:rc,fragmentShader:Qg,uniforms:{tHdr:{value:null},tBloom:{value:null},tLocal:{value:null},uExposure:{value:3},uBloom:{value:.01},uLocalAmt:{value:.55},uNightVis:{value:0},uGrain:{value:.012},uTime:{value:0},uRes:{value:new Xe},uGlarePos:{value:new D},uGlareAspect:{value:1},uFade:{value:1}},depthTest:!1,depthWrite:!1,blending:hn}),this.mesh=new We(gi(),this.down),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)}setSize(e,t){if(e===this.w&&t===this.h)return;this.w=e,this.h=t;for(let a of this.levels)a.dispose();this.levels=[],this.localRT?.dispose();let n=Math.max(1,e>>1),s=Math.max(1,t>>1);for(let a=0;a<7;a++)this.levels.push(new yt(n,s,{type:Pt,format:Mt,minFilter:et,magFilter:et,depthBuffer:!1})),n=Math.max(1,n>>1),s=Math.max(1,s>>1);let r=this.levels[3];this.localRT=new yt(r.width,r.height,{type:Pt,format:Mt,minFilter:et,magFilter:et,depthBuffer:!1})}pass(e,t,n){this.mesh.material=t,e.setRenderTarget(n),e.render(this.scene,this.cam)}render(e,t,n){let s=t,r=this.w,a=this.h;for(let c=0;c<this.levels.length;c++)this.down.uniforms.tSrc.value=s,this.down.uniforms.uTexel.value.set(1/r,1/a),this.down.uniforms.uFirst.value=c===0?1:0,this.pass(e,this.down,this.levels[c]),s=this.levels[c].texture,r=this.levels[c].width,a=this.levels[c].height;let o=this.levels[2];this.down.uniforms.tSrc.value=o.texture,this.down.uniforms.uTexel.value.set(1/o.width,1/o.height),this.down.uniforms.uFirst.value=0,this.pass(e,this.down,this.localRT);for(let c=this.levels.length-1;c>0;c--){let h=this.levels[c];this.up.uniforms.tSrc.value=h.texture,this.up.uniforms.uTexel.value.set(1/h.width,1/h.height),this.up.uniforms.uWeight.value=1,this.pass(e,this.up,this.levels[c-1])}let l=this.composite.uniforms;l.tHdr.value=t,l.tBloom.value=this.levels[0].texture,l.tLocal.value=this.localRT.texture,l.uRes.value.set(this.w,this.h),this.pass(e,this.composite,n)}};function ev(){try{let e=document.createElement("canvas").getContext("webgl2");if(!e)return!1;let t=!!e.getExtension("EXT_clip_control");return e.getExtension("WEBGL_lose_context")?.loseContext(),t}catch{return!1}}var tv=`
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform float uNear;
uniform float uFar;
uniform float uReversed;
uniform float uLogDepth;
in vec2 vUv;
void main() {
  vec3 c = texture(tColor, vUv).rgb;
  float z = texture(tDepth, vUv).r;
  float dist;
  if (uLogDepth > 0.5) {
    // three.js \u5BF9\u6570\u6DF1\u5EA6\uFF1Az = log2(1 + w) / log2(1 + far)
    dist = exp2(z * log2(uFar + 1.0)) - 1.0;
  } else if (uReversed > 0.5) {
    // \u53CD\u5411\u6DF1\u5EA6\uFF080..1\uFF09\uFF1Az = near(far - w) / (w (far - near))
    dist = z <= 0.0 ? 1e9 : uNear * uFar / (z * (uFar - uNear) + uNear);
  } else {
    float ndc = z * 2.0 - 1.0;
    dist = 2.0 * uNear * uFar / (uFar + uNear - ndc * (uFar - uNear));
  }
  if (z >= 1.0 && uReversed < 0.5) dist = 1e9;
  gl_FragColor = vec4(c, dist);
}
`,nv=`
out vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }
`,Mo=class{constructor(e){this.sceneMain=new Zt;this.sceneWater=new Zt;this.sceneFx=new Zt;this.sceneSpace=new Zt;this.envScene=new Zt;this.quadScene=new Zt;this.quadCam=new cn(-1,1,1,-1,0,1);this.width=1;this.height=1;this.scale=1;this.samples=4;let t=ev();this.renderer=new mo({canvas:e,antialias:!1,alpha:!1,powerPreference:"high-performance",reversedDepthBuffer:t,logarithmicDepthBuffer:!t,stencil:!1}),this.reversed=t&&this.renderer.capabilities.reversedDepthBuffer,this.logDepth=!this.reversed,this.renderer.toneMapping=un,this.renderer.outputColorSpace=qn,this.renderer.autoClear=!1,this.renderer.setClearColor(0,1),this.camera=new qt(55,1,.25,26e4),this.camera.position.set(0,1.7,0),this.skyMat=sc(!1),this.skyMat.uniforms.uCamWorld.value=this.camera.matrixWorld,this.skyMat.uniforms.uDepthZ.value=this.reversed?0:1,this.sceneMain.add(pu(this.skyMat)),this.envMat=sc(!0),this.envMat.uniforms.uCamWorld.value=this.camera.matrixWorld;let n=new We(gi(),this.envMat);n.frustumCulled=!1,this.envScene.add(n),this.envRT=new yt(256,128,{type:Pt,format:Mt,generateMipmaps:!0,minFilter:Dn,magFilter:et,depthBuffer:!1,wrapS:os,wrapT:Yt}),ce.tEnv.value=this.envRT.texture,this.copyMat=new Ge({vertexShader:nv,fragmentShader:tv,uniforms:{tColor:{value:null},tDepth:{value:null},uNear:{value:this.camera.near},uFar:{value:this.camera.far},uReversed:{value:this.reversed?1:0},uLogDepth:{value:this.logDepth?1:0}},depthTest:!1,depthWrite:!1}),this.quad=new We(gi(),this.copyMat),this.quad.frustumCulled=!1,this.quadScene.add(this.quad),this.post=new yo}setSize(e,t,n){let s=Math.min(window.devicePixelRatio||1,2),r=Math.max(16,Math.round(e*s*n)),a=Math.max(16,Math.round(t*s*n));if(this.scale=n,this.renderer.setPixelRatio(1),this.renderer.setSize(r,a,!1),this.renderer.domElement.style.width=e+"px",this.renderer.domElement.style.height=t+"px",r===this.width&&a===this.height&&this.mainRT)return;this.width=r,this.height=a,this.mainRT?.dispose(),this.copyRT?.dispose(),this.spaceRT?.dispose();let o=new Pn(r,a,Vt);o.minFilter=xt,o.magFilter=xt,this.mainRT=new yt(r,a,{type:Pt,format:Mt,samples:this.samples,depthBuffer:!0,depthTexture:o,minFilter:et,magFilter:et}),this.copyRT=new yt(r,a,{type:Pt,format:Mt,depthBuffer:!1,minFilter:et,magFilter:et}),this.spaceRT=new yt(r,a,{type:Pt,format:Mt,depthBuffer:!1}),ce.tSpace.value=this.spaceRT.texture,this.post.setSize(r,a),this.camera.aspect=r/a,this.camera.updateProjectionMatrix()}updateViewUniforms(){let e=this.camera;e.updateMatrixWorld();let t=Math.tan(e.fov*Math.PI/360);ce.uTanHalf.value.set(t*e.aspect,t),ce.uPixAng.value=2*t/this.height,ce.uRes.value.set(this.width,this.height)}renderEnv(){let e=this.renderer;e.setRenderTarget(this.envRT),e.render(this.envScene,this.quadCam)}renderSpace(){let e=this.renderer;e.setRenderTarget(this.spaceRT),e.setClearColor(0,1),e.clear(!0,!1,!1),e.render(this.sceneSpace,this.camera)}renderMain(){let e=this.renderer;e.setRenderTarget(this.mainRT),e.setClearColor(0,1),e.clear(!0,!0,!1),e.render(this.sceneMain,this.camera)}copyForWater(){let e=this.renderer;this.copyMat.uniforms.tColor.value=this.mainRT.texture,this.copyMat.uniforms.tDepth.value=this.mainRT.depthTexture,e.setRenderTarget(this.copyRT),e.render(this.quadScene,this.quadCam)}renderWaterAndFx(){let e=this.renderer;e.setRenderTarget(this.mainRT),e.render(this.sceneWater,this.camera),e.render(this.sceneFx,this.camera)}renderPost(){this.post.render(this.renderer,this.mainRT.texture,null)}};var bo=class{constructor(e,t,n){this.cam=e;this.el=t;this.dragging=!1;this.lastX=0;this.lastY=0;this.pointers=new Map;this.pinchDist=0;this.onInteract=null;this.minFov=2;this.maxFov=100;this.home=null;this.onDown=e=>{if(this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),this.pointers.size===1)this.dragging=!0,this.lastX=e.clientX,this.lastY=e.clientY;else if(this.pointers.size===2){let t=[...this.pointers.values()];this.pinchDist=Math.hypot(t[0].x-t[1].x,t[0].y-t[1].y)}this.el.setPointerCapture?.(e.pointerId),this.onInteract?.()};this.onMove=e=>{if(!this.pointers.has(e.pointerId))return;if(this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),this.pointers.size===2){let a=[...this.pointers.values()],o=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);this.pinchDist>0&&this.zoomBy(this.pinchDist/o),this.pinchDist=o;return}if(!this.dragging)return;let t=e.clientX-this.lastX,n=e.clientY-this.lastY;this.lastX=e.clientX,this.lastY=e.clientY;let s=this.el.clientHeight||800,r=this.target.fov*Math.PI/180/s;this.target.yaw-=t*r,this.target.pitch+=n*r,this.clampTarget(),this.view.yaw=this.target.yaw,this.view.pitch=this.target.pitch};this.onUp=e=>{this.pointers.delete(e.pointerId),this.pointers.size===0&&(this.dragging=!1),this.pointers.size<2&&(this.pinchDist=0)};this.onWheel=e=>{e.preventDefault();let t=Math.exp(e.deltaY*.0012);this.zoomBy(t),this.onInteract?.()};this.view={...n},this.target={...n},t.addEventListener("pointerdown",this.onDown),window.addEventListener("pointermove",this.onMove),window.addEventListener("pointerup",this.onUp),window.addEventListener("pointercancel",this.onUp),t.addEventListener("wheel",this.onWheel,{passive:!1}),t.addEventListener("dblclick",()=>this.reset())}setHome(e){this.home={...e}}reset(){this.home&&this.lookAt(this.home.yaw,this.home.pitch,this.home.fov)}lookAt(e,t,n){let s=e-this.target.yaw;s=Math.atan2(Math.sin(s),Math.cos(s)),this.target.yaw+=s,this.target.pitch=t,n!==void 0&&(this.target.fov=n)}get targetView(){return this.target}zoomBy(e){this.target.fov=Math.min(this.maxFov,Math.max(this.minFov,this.target.fov*e))}turn(e,t){this.target.yaw+=e,this.target.pitch+=t,this.clampTarget()}clampTarget(){let e=Math.PI/2-.001;this.target.pitch=Math.max(-e,Math.min(e,this.target.pitch))}update(e){let t=1-Math.exp(-e*7);this.view.yaw+=(this.target.yaw-this.view.yaw)*t,this.view.pitch+=(this.target.pitch-this.view.pitch)*t;let n=1-Math.exp(-e*8);this.view.fov=Math.exp(Math.log(this.view.fov)+(Math.log(this.target.fov)-Math.log(this.view.fov))*n),this.apply()}apply(){let e=this.cam;e.fov=this.view.fov;let t=Math.cos(this.view.yaw),n=Math.sin(this.view.yaw),s=Math.cos(this.view.pitch),r=Math.sin(this.view.pitch),a={x:t*s,y:r,z:n*s};e.up.set(0,1,0),e.lookAt(e.position.x+a.x,e.position.y+a.y,e.position.z+a.z),e.updateProjectionMatrix(),e.updateMatrixWorld()}heading(){let t=90+this.view.yaw*180/Math.PI;return t=(t%360+360)%360,t}};var At={R:5e4,halfWidth:500,wallHeight:50,rotationMinutes:236,spokeLongitudes:[-35,25,85,145,205,265],mirror:{rMin:3e3,rMax:7e3,zMax:3750,gap:260},hub:{radius:120,halfLength:360}},So={a:1495978707e-1,e:.0475,yearDays:365.2422,starRadius:695700,perihelionDay:2.6},mu={eyeHeight:1.7},gu={dawnStart:4.5,dawnEnd:7.5,duskStart:16.5,duskEnd:19.5},sr=1127,vu=1440/At.rotationMinutes,xu=1.234,eM=Math.PI/180;var iv=[31,28,31,30,31,30,31,31,30,31,30,31];function _u(i){return i%4===0&&i%100!==0||i%400===0}function Jn(i){return _u(i)?366:365}function ac(i,e){return e===2&&_u(i)?29:iv[e-1]}function xs(i){let e=0;if(i>=sr)for(let t=sr;t<i;t++)e+=Jn(t);else for(let t=i;t<sr;t++)e-=Jn(t);return e}function Ot(i){let e=sr,t=Math.floor(i);for(;t<0;)e--,t+=Jn(e);for(;t>=Jn(e);)t-=Jn(e),e++;let n=t,s=1;for(;s<=12&&t>=ac(e,s);)t-=ac(e,s),s++;let r=i-Math.floor(i);return{year:e,month:s,day:t+1,hour:r*24,doy:n+r,yearLength:Jn(e)}}function wo(i,e,t,n){let s=xs(i);for(let r=1;r<e;r++)s+=ac(i,r);return s+(t-1)+n/24}var yu=["\u51AC","\u6625","\u590F","\u79CB"];function ar(i){return i>=3&&i<=5?1:i>=6&&i<=8?2:i>=9&&i<=11?3:0}function rr(i){return(i<10?"0":"")+i}function To(i,e=!1){let t=Math.floor(i*3600+1e-6);t=(t%86400+86400)%86400;let n=Math.floor(t/3600),s=Math.floor(t%3600/60),r=t%60;return e?`${rr(n)}:${rr(s)}:${rr(r)}`:`${rr(n)}:${rr(s)}`}function Ao(i){return i=Math.max(0,Math.min(1,i)),i*i*(3-2*i)}function vi(i){let e=(i%24+24)%24,{dawnStart:t,dawnEnd:n,duskStart:s,duskEnd:r}=gu;return e<t||e>=r?0:e<n?Ao((e-t)/(n-t)):e<s?1:Ao((r-e)/(r-s))}function Ui(i){let e=vi(i);if(e<=0)return 0;let t=5.6;return(Math.exp(t*e)-1)/(Math.exp(t)-1)}function Mu(i){let t=1-vi(i);return[1,.965-.07*t,.925-.16*t]}function Lt(i,e,t,n,s){return i<=e||i>=s?0:i<t?Ao((i-e)/(t-e)):i<=n?1:Ao((s-i)/(s-n))}function oc(i){let e=Ot(i),t=e.doy/e.yearLength,n=e.doy,s=Math.cos((n-202)/365.2422*Math.PI*2),r=Lt(n,68,125,296,340)*.88+.12,a=Lt(n,262,292,318,345),o=Lt(n,62,80,98,118),l=Lt(n,70,95,130,165),c=Math.max(Lt(n,300,335,366,400),Lt(n+365,300,335,366,420))*.85,h=Lt(n,60,78,100,120),p=Math.max(Lt(n,140,158,168,180),Lt(n,245,268,285,300)),u=Math.max(Lt(n,168,176,182,195),Lt(n,285,300,360,400),Lt(n+365,285,300,420,430)),m=Lt(n,110,122,150,166),v=Lt(n,140,176,238,256),g=Lt(n,238,256,282,297),f=Math.max(Lt(n,290,320,366,420),Lt(n,-60,-20,96,128)),d=Lt(n,126,142,160,172),x=Lt(n,168,192,262,286);return{yearPhase:t,warmth:s,leaf:r,autumn:a,bloom:o,fresh:l,dry:c,canola:h,harvest:p,stubble:u,riceFlood:m,riceGreen:v,riceGold:g,wheatGreen:f,wheatGold:d,summerCrop:x}}function bu(i,e,t,n){let s=Ot(i),a=15+4*oc(i).warmth,o=s.hour,l=(o-15)/24*Math.PI*2,c=4.2*(1-.55*e)*(1-.3*n),h=Math.cos(l)*c;return o>3&&o<9&&(h-=.6*Math.sin((o-3)/6*Math.PI)),a+h-2.2*t}var Po=["clear","cloudy","fog","showers","rain"],Io={clear:"\u6674",cloudy:"\u6D41\u4E91",fog:"\u6668\u96FE",showers:"\u9635\u96E8",rain:"\u9634\u96E8"},lc={clear:{cover:.16,cloudBase:1.7,cloudThick:.9,cloudDark:0,stratus:0,wind:2.6,haze:.75,fog:0,fogTop:40,rainBase:0,showers:0,high:.3},cloudy:{cover:.5,cloudBase:1.35,cloudThick:1.5,cloudDark:.12,stratus:.05,wind:7.5,haze:.95,fog:0,fogTop:40,rainBase:0,showers:0,high:.45},fog:{cover:.06,cloudBase:2.2,cloudThick:.6,cloudDark:0,stratus:0,wind:.9,haze:1.7,fog:1,fogTop:46,rainBase:0,showers:0,high:.2},showers:{cover:.6,cloudBase:1.15,cloudThick:3.4,cloudDark:.5,stratus:.08,wind:6.2,haze:1.25,fog:0,fogTop:40,rainBase:0,showers:1,high:.3},rain:{cover:1,cloudBase:.75,cloudThick:2.2,cloudDark:.55,stratus:1,wind:4.6,haze:2.6,fog:.22,fogTop:40,rainBase:.72,showers:.25,high:0}};function Su(i){return{...lc[i]}}function sv(i,e,t){let n={};for(let s of Object.keys(i))n[s]=i[s]+(e[s]-i[s])*t;return n}function dn(i,e,t){let n=Eo(i*.1031),s=Eo(e*.1031),r=Eo(t*.1031),a=n*(s+33.33)+s*(r+33.33)+r*(n+33.33);return n+=a,s+=a,r+=a,Eo((n+s)*r)}function Eo(i){return i-Math.floor(i)}function Co(i){return i*i*(3-2*i)}function wu(i,e,t,n){let s=Math.floor(i),r=Math.floor(e),a=Math.floor(t),o=Co(i-s),l=Co(e-r),c=Co(t-a),h=n,p=G=>(G%h+h)%h,u=p(s),m=p(s+1),v=p(a),g=p(a+1),f=dn(u,r,v),d=dn(m,r,v),x=dn(u,r+1,v),M=dn(m,r+1,v),b=dn(u,r,g),A=dn(m,r,g),w=dn(u,r+1,g),C=dn(m,r+1,g),_=f+(d-f)*o,S=x+(M-x)*o,U=b+(A-b)*o,R=w+(C-w)*o,F=_+(S-_)*l,O=U+(R-U)*l;return F+(O-F)*c}function rv(i,e,t,n,s,r,a){let o=(i-t)/3.2,l=(e-n)/3.2,c=0,h=.5,p=1,u=0;for(let g=0;g<4;g++)c+=h*wu(o*p,s*p*.7+g*17,l*p,1440*p),u+=h,h*=.5,p*=2.03;c/=u;let m=wu((i-t)/14.4,s*.5+91,(e-n)/14.4,320);c=c*(1-.45*a)+m*.45*a;let v=1-r;return Math.max(0,Math.min(1,(c-v*.92-.04)/.22))}function cc(i,e,t){let n=ar(t),s={0:[.3,.3,.2,.02,.18],1:[.3,.3,.15,.1,.15],2:[.36,.28,.06,.24,.06],3:[.36,.24,.2,.06,.14]},r=dn(i*3+e,7,3),o=(l=>{let c=s[n],h=0;for(let p=0;p<5;p++)if(h+=c[p],l<h)return Po[p];return"clear"})(r);return e>0&&dn(i*3+e,11,5)<.45&&(o=cc(i,e-1,t)),o==="fog"&&e!==0&&(o="clear"),o==="showers"&&e===0&&(o="cloudy"),o}function Tu(i){let e=.3333333333333333,t=Math.floor(i/e),n=i/e-t,s=Math.floor(t/3),r=Ot(i),a=cc(s,t-s*3,r.month),o=t-1,l=Math.floor(o/3),c=cc(l,o-l*3,r.month),h=Math.min(1,n*8/1.6);return{params:sv(lc[c],lc[a],Co(h)),kind:h>.5?a:c}}var Ro=class{constructor(e){this.mode="auto";this.target=Su("clear");this.targetKind="clear";let t=Tu(e);this.state={...t.params,kind:t.kind,windDir:.35,offU:37,offV:11,evo:3,rain:0,wet:t.params.rainBase>.3?.8:0,fogNow:0,overhead:0}}setMode(e){this.mode=e}snap(e){this.computeTarget(e),Object.assign(this.state,this.target),this.state.kind=this.targetKind,this.state.wet=this.target.rainBase>.3?.85:this.state.wet*.3}computeTarget(e){if(this.mode==="auto"){let t=Tu(e);this.target=t.params,this.targetKind=t.kind}else this.target=Su(this.mode),this.targetKind=this.mode}update(e,t,n){this.computeTarget(e);let s=this.state,r=1-Math.exp(-(n/3.5+t*24/.6));for(let f of Object.keys(this.target))s[f]+=(this.target[f]-s[f])*r;s.kind=this.targetKind;let a=(e%1+1)%1*24;s.windDir=.35+.5*Math.sin(e*.37)+.25*Math.sin(e*2.1);let o=t*86400,l=s.wind*1.6*o/1e3;s.offU+=Math.cos(s.windDir)*l,s.offV+=Math.sin(s.windDir)*l;let c=4608;s.offU=(s.offU%c+c)%c,s.offV=(s.offV%c+c)%c,s.evo+=t*24*.9,s.evo>4e3&&(s.evo-=4e3);let h=Ui(a),p=a<12?1:0,u=1-Math.min(1,Math.max(0,(h-.25)/.75))*(p?.85:.6);a>9.5&&a<19&&(u=Math.min(u,.45-.25*Math.sin((a-9.5)/9.5*Math.PI))),s.fogNow=s.fog*Math.max(.12,u);let m=rv(0,0,s.offU,s.offV,s.evo,s.cover,s.showers);s.overhead=m;let v=s.showers*Math.max(0,(m-.55)/.35)*Math.min(1,s.cloudThick/2.5);s.rain=Math.min(1,Math.max(s.rainBase*(.8+.2*m),v));let g=t*24;s.wet+=s.rain*g*3,s.wet-=g*(.18+.3*h)*(1-s.rain),s.wet=Math.max(0,Math.min(1,s.wet))}};var or=Math.PI*2,av=1.05;function ov(i,e){let t=i+e*Math.sin(i);for(let n=0;n<12;n++){let s=t-e*Math.sin(t)-i;t-=s/(1-e*Math.cos(t))}return t}function Oi(i){let{e,a:t,yearDays:n,perihelionDay:s}=So,r=(i-s)/n*or%or,a=ov(r,e),o=2*Math.atan2(Math.sqrt(1+e)*Math.sin(a/2),Math.sqrt(1-e)*Math.cos(a/2)),l=t*(1-e*Math.cos(a)),c=o-r;return c=Math.atan2(Math.sin(c),Math.cos(c)),{M:r,E:a,nu:o,r:l,C:c}}function Bi(i){return xu+or*vu*i}function cr(i){return i=i%or,i<0?i+or:i}var Au=mu.eyeHeight/1e3;function pn(i,e){let t=e??Oi(i),n=Bi(i),s=Math.cos(n),r=Math.sin(n),a=At.R-Au,o=0,l=-Math.sin(t.C)*t.r,c=Math.cos(t.C)*t.r,h=o-a*s,p=l-a*r,u=c,m=Math.hypot(h,p,u),v=(-r*h+s*p)/m,g=(-s*h-r*p)/m,f=u/m,d=Math.asin(Math.max(-1,Math.min(1,g))),x=Math.atan2(v,f),M=Math.atan((At.wallHeight-Au)*Math.cos(x)/At.halfWidth),b=Math.asin(So.starRadius/m);return{dir:[v,g,f],elevation:d,azimuthFromSouth:x,angRadius:b,wallAngle:M,margin:d+b-M,C:t.C,r:t.r}}function Ru(i,e){let n=(e??Oi(i)).M+av,s=[0,0,1],r=[-Math.cos(n),-Math.sin(n),0],a=[-Math.sin(n),Math.cos(n),0],o=Bi(i),l=Math.cos(o),c=Math.sin(o),h=[-c*s[0]+l*a[0],-c*s[1]+l*a[1],-c*s[2]+l*a[2]],p=[-l*s[0]-c*a[0],-l*s[1]-c*a[1],-l*s[2]-c*a[2]],u=r;return[h[0],h[1],h[2],p[0],p[1],p[2],u[0],u[1],u[2]]}var lv=.6,Eu=(()=>{let e=[],n=0,s=[];for(let r=0;r<220;r++)for(let a=0;a<220;a++){let o=(r+.5)/220*2-1,l=(a+.5)/220*2-1,c=o*o+l*l;if(c>1)continue;let h=Math.sqrt(1-c),p=1-lv*(1-h);n+=p,s.push({y:l,w:p})}for(let r=0;r<=128;r++){let a=r/128*2,o=0;for(let l of s)l.y>1-a&&(o+=l.w);e.push(o/n)}return e})();function Pu(i,e){let n=Math.max(0,Math.min(2,i/e))/2*128,s=Math.min(127,Math.floor(n)),r=n-s;return Eu[s]*(1-r)+Eu[s+1]*r}var lr=At.rotationMinutes/1440;function Cu(i){let e=i-lr*.25,t=i+lr*.25,n=.6180339887,s=t-n*(t-e),r=e+n*(t-e),a=pn(s).margin,o=pn(r).margin;for(let l=0;l<40;l++)a>o?(t=r,r=s,o=a,s=t-n*(t-e),a=pn(s).margin):(e=s,s=r,a=o,r=e+n*(t-e),o=pn(r).margin);return(e+t)/2}function cv(i){let t=Oi(i).C>=0?Math.PI/2:3*Math.PI/2,n=cr(Bi(i)),s=t-n;return s<-.3&&(s+=Math.PI*2),i+s/(Math.PI*2)*lr}function Do(i,e){let t=i,n=e;for(let s=0;s<40;s++){let r=(t+n)/2;pn(r).margin>0?t=r:n=r}return(t+n)/2}function hr(i,e=400){if(pn(i).margin>0){let s=i;for(;pn(s).margin>0;)s-=.5/1440;let r=Do(s+.5/1440,s),a=i;for(;pn(a).margin>0;)a+=.5/1440;let o=Do(a-.5/1440,a),l=Cu((r+o)/2),c=Oi(l);return{start:r,peak:l,end:o,maxMargin:pn(l).margin,kind:c.C>=0?"spring":"autumn"}}let t=i,n=i+e;for(;t<n;){let s=Oi(t);if(Math.abs(s.C)<.0935){t+=.5;continue}let a=cv(t),o=Cu(a),l=pn(o);if(l.margin>0&&o>=i-1e-6){let c=lr*.2,h=Do(o,o-c),p=Do(o,o+c);if(p>i)return{start:h,peak:o,end:p,maxMargin:l.margin,kind:s.C>=0?"spring":"autumn"}}t=Math.max(o,a)+lr*.5}return null}function hc(i){let e=[],t=i,n=null,s=i+So.yearDays+2;for(;t<s;){let r=hr(t,s-t);if(!r)break;n&&r.start-n.end<2?(n.end=r.end,n.count++,n.longest=Math.max(n.longest,(r.end-r.start)*1440)):(n&&e.push(n),n={kind:r.kind,start:r.start,end:r.end,center:0,count:1,longest:(r.end-r.start)*1440}),t=r.end+1e-4}n&&e.push(n);for(let r of e)r.center=(r.start+r.end)/2;return e}var ut={tShadowKey:{value:null},uShadowKeyMat:{value:new ht},uShadowKeyOn:{value:0},uShadowKeyTexel:{value:new Xe(1/2048,1/2048)},tShadowStar:{value:null},uShadowStarMat:{value:new ht},uShadowStarOn:{value:0},uShadowStarTexel:{value:new Xe(1/2048,1/2048)},tTown:{value:null},uTownGrid:{value:new Je(0,0,1,1)},uSeasonC:{value:new Je},uSeasonD:{value:new Je}};var hv=new D;function Iu(i,e){let n=0,s=0,r=0,o=At.halfWidth*2/(4*At.R),l=.11;for(let h=0;h<96;h++){let p=(h+.5)/96*Math.PI*2,u=p/2,m=Math.sin(u);if(m<.03)continue;let v=i+p/(Math.PI*2)*24,g=Ui(v);if(g<=0)continue;let f=Math.exp(-2*l/Math.max(m,.05)),d=.2*g*f/Math.PI,x=o*d*(Math.PI*2/96);r+=x,n+=x*Math.cos(u),s+=x*m}let c=Math.hypot(n,s)||1;return e.set(n/c,s/c,0),r}var uc=-1;function Du(i,e){let n=Ot(i).hour,s=Oi(i),r=pn(i,s),a=Ui(n),o=Mu(n);ce.uLocalHour.value=n,ce.uMirrorE.value.set(o[0]*a,o[1]*a,o[2]*a).multiply(ce.uDayE.value);let l=Bi(i);if(ce.uMirrorDir.value.set(.045*Math.sin(l)+.02,1,.03+.02*Math.cos(l*.5)).normalize(),ce.uMirrorDay.value=a,uc<0){let O=0;for(let G=0;G<24;G+=.5)O=Math.max(O,Iu(G,hv));uc=O}let c=Iu(n,ce.uArchDir.value),h=1-.75*e.cover;ce.uArchE.value.set(.78,.84,1).multiplyScalar(c*h),ce.uArchMax.value=uc,ce.uStarDir.value.set(r.dir[0],r.dir[1],r.dir[2]),ce.uStarAlpha.value=r.angRadius;let p=r.r/1495978707e-1,u=1.4/(p*p),m=r.elevation,v=m>-.02?Math.min(1,(m+.02)/.02):0;ce.uStarE.value.set(1,.955,.9).multiplyScalar(u*v),ce.uStarSpaceE.value.set(1,.955,.9).multiplyScalar(u);let g=Pu(r.margin,r.angRadius),f=1/Math.max(Math.sin(Math.max(m,.001))+.015,.03),d=Math.exp(-.11*f*(1+.6*e.haze)),x=u*g*d*(1-.85*e.cover*(.4+.6*e.stratus));ce.uStarGround.value.set(1,.75,.5).multiplyScalar(x),ce.uStarMargin0.value=r.margin,ce.uStarVisSky.value=g;let M=At.wallHeight-At.halfWidth*Math.tan(m+r.angRadius*.5),b=m>-.012?Math.exp(-Math.max(M,0)/8)*Math.min(1,(m+.012)/.02):0;ce.uAmbSky.value.copy(ce.uMirrorE.value).multiplyScalar(.28*(1+e.cover*.6));let A=Ru(i,s);ce.uL2I.value.set(A[0],A[3],A[6],A[1],A[4],A[7],A[2],A[5],A[8]),ce.uSpin.value=cr(l),ce.uTimeS.value=i*86400%86400,ce.uFarTime.value=i*24%2400;let w=oc(i);ce.uSeasonA.value.set(w.leaf,w.autumn,w.dry,w.fresh),ce.uSeasonB.value.set(w.harvest,w.stubble,w.canola,w.warmth),ut.uSeasonC.value.set(w.riceFlood,w.riceGreen,w.riceGold,w.wheatGreen),ut.uSeasonD.value.set(w.wheatGold,w.summerCrop,w.bloom,0),ce.uMieK.value=.0042*e.haze+.03*e.rain+.002*e.fogNow,ce.uRainExt.value=e.rain*.12,ce.uCloudCover.value=e.cover,ce.uCloudBase.value=e.cloudBase,ce.uCloudThick.value=e.cloudThick,ce.uCloudDark.value=e.cloudDark,ce.uStratus.value=e.stratus,ce.uShowers.value=e.showers,ce.uHighCloud.value=e.high,ce.uCloudOff.value.set(e.offU,e.offV),ce.uCloudEvo.value=e.evo,ce.uRain.value=e.rain,ce.uFogNow.value=e.fogNow,ce.uFogTop.value=e.fogTop,ce.uWet.value=e.wet,ce.uWind.value.set(Math.cos(e.windDir)*e.wind,Math.sin(e.windDir)*e.wind),ce.uFarCloudBias.value=0;let C=1-vi(n);ce.uNight.value=C;let _=Math.max(0,Math.min(1,(C-.25)/.3)),S=n>.5&&n<5?.6:1,U=ce.uGlow.value;U[0].set(1.6,.3,1.5,.0035*_*S),U[1].set(9.7,1.25,.7,9e-4*_*S),U[2].set(7.3,2.3,.6,7e-4*_*S),U[3].set(24,3.1,1.2,.0012*_*S);let R=e.cover*(.35+.65*e.stratus),F=a*(1-.72*R)+c*h*1+x*4+b*u*.07*(1-.7*R)+6e-5;return{hour:n,mirror:a,arch:c,starGround:x,starFrac:g,star:r,season:w,sceneE:F,skyLit:b}}var Lu=`// ===== \u5730\u5F62\u9AD8\u7A0B\u751F\u6210\uFF08GPU\uFF0C\u4E00\u6B21\u6027\uFF09=====
// \u4F9D\u8D56 common.glsl\u3002\u8F93\u51FA\uFF1A\u9AD8\u7A0B\u7F16\u7801\u4E3A 24 \u4F4D\u5B9A\u70B9\uFF08RGBA8\uFF09\uFF0C\u4F9B CPU \u8BFB\u56DE
uniform sampler2D tRiverD;   // \u6CB3\u6D41\u4E2D\u5FC3\u7EBF\u8DDD\u79BB\uFF08\u7C73\uFF09\uFF0C\u4E0E\u8F93\u51FA\u540C\u7F51\u683C
uniform sampler2D tRailD;    // \u94C1\u8DEF\u4E2D\u7EBF\u8DDD\u79BB\uFF08\u7C73\uFF09
uniform vec4 uGrid;          // x0, z0, size, res
uniform float uIsFar;

varying vec2 vUv;

float riverLevel(float x) { return -63.0 - 0.00025 * clamp(x, -40000.0, 90000.0); }
float riverHalfW(float x) {
  float t = clamp((x + 8000.0) / 40000.0, 0.0, 1.0);
  return 24.0 + 34.0 * t + ((x > 400.0 && x < 3400.0) ? 6.0 : 0.0);
}

// \u8C37\u5E95\u534A\u5BBD\uFF08\u7C73\uFF09
float valleyHalf(float x) {
  float w = 950.0;
  w = mix(w, 700.0, smoothstep(-1500.0, -7000.0, x));
  w = mix(w, 1750.0, smoothstep(1800.0, 8000.0, x));
  w = mix(w, 2600.0, smoothstep(8000.0, 13500.0, x));
  // \u6CB3\u8C37\u51FA\u53E3\uFF1A\u4E24\u4FA7\u5C71\u4E18\u6536\u62E2
  w = mix(w, 620.0, smoothstep(14500.0, 17200.0, x) * (1.0 - smoothstep(19800.0, 23000.0, x)));
  w = mix(w, 7000.0, smoothstep(22000.0, 34000.0, x));
  return w;
}

float ridged2(vec2 p, int oct) {
  float s = 0.0, a = 0.5, prev = 1.0, n = 0.0;
  for (int i = 0; i < 6; i++) {
    if (i >= oct) break;
    float v = 1.0 - abs(vnoise2(p) * 2.0 - 1.0);
    v *= v;
    s += a * v * prev;
    prev = v;
    n += a;
    p = p * 2.07 + vec2(5.3, 1.7);
    a *= 0.5;
  }
  return s / n;
}

float segDist(vec2 p, vec2 a, vec2 b, out float t) {
  vec2 u = b - a;
  t = clamp(dot(p - a, u) / dot(u, u), 0.0, 1.0);
  return length(p - a - u * t);
}

// \u540E\u5C71\uFF1A\u4ECE\u897F\u5317\u7684\u5C71\u5CAD\u4F38\u51FA\u7684\u4E00\u9053\u5C71\u810A\uFF0C\u672B\u7AEF\u5C31\u662F\u89C2\u5BDF\u70B9
float spur(vec2 p, float floorH) {
  vec3 S[6];
  S[0] = vec3(-2600.0, -2100.0, 150.0);
  S[1] = vec3(-1550.0, -1300.0, 92.0);
  S[2] = vec3(-860.0, -640.0, 40.0);
  S[3] = vec3(-380.0, -220.0, 11.0);
  S[4] = vec3(0.0, 0.0, 0.0);
  S[5] = vec3(26.0, 18.0, -3.0);
  float best = -1e9;
  for (int i = 0; i < 5; i++) {
    float t;
    float d = segDist(p, S[i].xy, S[i + 1].xy, t);
    float hs = mix(S[i].z, S[i + 1].z, t);
    vec2 dir = normalize(S[i + 1].xy - S[i].xy);
    // \u4E1C\u5357\u4FA7\uFF08\u671D\u5411\u5B66\u6821\u4E0E\u6CB3\uFF09\u66F4\u9661
    vec2 nrm = vec2(-dir.y, dir.x);
    float side = dot(p - S[i].xy, nrm);
    float w = side > 0.0 ? 108.0 : 270.0;
    if (i >= 3) w = side > 0.0 ? 100.0 : 190.0;
    // \u672B\u7AEF\u4E4B\u5916\u4E5F\u5411\u4E1C\u8FC5\u901F\u4E0B\u964D
    if (i == 4 && t >= 1.0) w = 95.0;
    float prof = exp(-sq(d / w));
    float h = floorH + (hs - floorH) * prof;
    best = max(best, h);
  }
  // \u5C71\u9876\uFF1A\u89C2\u5BDF\u70B9\u6240\u5728\u7684\u5C0F\u5E73\u53F0\uFF0C\u5411\u4E1C\u3001\u5411\u5357\u662F\u9661\u5761\uFF08\u7EA6 21\xB0\uFF09\uFF0C\u89C6\u7EBF\u53EF\u4EE5\u8D8A\u8FC7\u5761\u9876\u770B\u5230\u5C71\u811A\u7684\u5B66\u6821
  float r = length(p - vec2(-3.0, 0.0));
  float cone = -0.385 * max(0.0, r - 4.0) - 0.0006 * sq(max(0.0, r - 4.0));
  cone = max(cone, floorH + 0.0);
  // \u897F\u5317\u65B9\u5411\u6CBF\u5C71\u810A\u7F13\u7F13\u62AC\u5347
  return max(min(best, cone + max(0.0, -p.x - p.y) * 0.32), cone);
}

float H(vec2 p, float dr, float drail) {
  float lvl = riverLevel(p.x);
  float hw = riverHalfW(p.x);
  // \u8C37\u5E95\uFF1A\u8FD1\u6CB3\u5904\u5E73\uFF0C\u8FDC\u79BB\u6CB3\u7565\u62AC\u5347
  float floorH = lvl + 3.2 + 1.4 * (vnoise2(p / 210.0) - 0.5) + 0.8 * (vnoise2(p / 47.0) - 0.5) + clamp(dr - 80.0, 0.0, 900.0) * 0.0035;
  vec2 q = p / 1000.0;
  float big = fbm2(q / 6.5 + vec2(3.1, 7.7), 4);
  float rid = ridged2(q / 2.4 + vec2(1.3, 4.2), 5);
  float det = fbm2(q * 1.7 + vec2(9.0, 2.0), 4);
  float amp = 25.0 + 260.0 * smoothstep(0.25, 0.75, big) + 150.0 * rid * smoothstep(0.3, 0.65, big) + 40.0 * det;
  // \u6CB3\u8C37\u51FA\u53E3\u4E24\u4FA7\u7684\u5C71\u66F4\u9AD8\u4E00\u4E9B
  amp *= 1.0 + 0.6 * smoothstep(13000.0, 17000.0, p.x) * (1.0 - smoothstep(21000.0, 25000.0, p.x));
  float W = valleyHalf(p.x);
  float t = smoothstep(W, W + 1500.0 + 1200.0 * big, dr);
  float hills = floorH + amp;
  float h = mix(floorH, hills, t);
  // \u8FDC\u5904\uFF1A\u8D77\u4F0F\u53D8\u7F13\u5E76\u56DE\u5230\u57FA\u51C6\u9762\uFF08\u8FDC\u666F\u7740\u8272\u5668\u5047\u5B9A\u5730\u9762\u5728\u57FA\u51C6\u9762\u9644\u8FD1\uFF09
  float r = length(p);
  float farT = smoothstep(32000.0, 84000.0, r);
  float plain = -10.0 + 70.0 * fbm2(q / 9.0 + 5.0, 4) - 20.0 * (1.0 - smoothstep(0.0, 3000.0, dr));
  h = mix(h, mix(plain, 0.0, smoothstep(60000.0, 86000.0, r)), farT);

  // \u540E\u5C71
  if (uIsFar < 0.5 || r < 4000.0) {
    float sp = spur(p, floorH);
    h = max(h, sp);
  }
  // \u5B66\u6821\uFF1A\u5E73\u6574\u7684\u6821\u56ED
  vec2 sc0 = vec2(165.0, -185.0), sc1 = vec2(525.0, 175.0);
  vec2 dd = max(max(sc0 - p, p - sc1), vec2(0.0));
  float ds = length(dd);
  float sm = 1.0 - smoothstep(0.0, 22.0, ds);
  h = mix(h, -59.2, sm);
  if (uIsFar > 0.5) return h;
  // \u94C1\u8DEF\uFF1A\u8DEF\u57FA\u6216\u8DEF\u5811
  float grade = lvl + 5.6;
  float rb = 1.0 - smoothstep(7.0, 24.0 + abs(h - grade) * 1.4, drail);
  h = mix(h, grade, rb);
  // \u6CB3\u9053
  float bank = smoothstep(hw - 2.0, hw + 9.0, dr);
  float bed = lvl - 0.4 - 2.6 * (1.0 - sq(clamp(dr / hw, 0.0, 1.0)));
  h = mix(bed, h, bank);
  // \u6CB3\u5CB8\u9760\u6C34\u5904\u4E0D\u9AD8\u8FC7\u6C34\u9762\u592A\u591A
  h = min(h, mix(lvl + 0.6, h, smoothstep(hw + 2.0, hw + 22.0, dr)));
  return h;
}

void main() {
  ivec2 ij = ivec2(gl_FragCoord.xy);
  float cell = uGrid.z / uGrid.w;
  vec2 p = uGrid.xy + (vec2(ij) + 0.5) * cell;
  float dr = texelFetch(tRiverD, ij, 0).r;
  float drl = texelFetch(tRailD, ij, 0).r;
  float h = H(p, dr, drl);
  float v = clamp((h + 1000.0) / 3000.0, 0.0, 1.0) * 16777215.0;
  float r = floor(v / 65536.0);
  float g = floor((v - r * 65536.0) / 256.0);
  float b = floor(v - r * 65536.0 - g * 256.0);
  gl_FragColor = vec4(r, g, b, 255.0) / 255.0;
}
`;var Fu={x0:-6e3,z0:-11e3,size:22e3,res:2048},Nu={x0:-9e4,z0:-9e4,size:18e4,res:1024},ft={x0:-700,z0:-2400,size:6e3,res:2048},fv=[[-6e4,9e3],[-38e3,6500],[-24e3,4200],[-14e3,2600],[-9e3,1700],[-5200,1450],[-2600,930],[-900,700],[300,570],[1100,430],[1900,470],[2700,690],[3600,980],[4600,900],[5600,1240],[7e3,1680],[8600,1520],[10200,2080],[12400,2580],[14600,2420],[16600,3050],[18600,3300],[20800,3850],[24e3,3500],[28e3,4400],[34e3,4100],[42e3,5600],[52e3,5200],[64e3,7400],[8e4,8200],[96e3,9e3]],dv=[[-4e4,-4200],[-2e4,-2600],[-12e3,-1700],[-7e3,-1250],[-3500,-880],[-1500,-700],[0,-620],[700,-540],[1300,-520],[2200,-515],[3500,-420],[5e3,-200],[6400,260],[7600,1e3],[8600,1850],[9800,2700],[11600,3400],[13800,3820],[16e3,4150],[17800,4600],[19400,4950],[21500,5100],[26e3,5600],[4e4,7e3],[7e4,9500]],Bt={x:980,len:220},Uu={x0:165,x1:525,z0:-185,z1:175,level:-59.2};var pv=[[1500,120,1500,520,1],[2600,500,900,520,.85],[1600,1050,900,300,.75],[900,-330,520,200,.9]];function zi(i){return-63-25e-5*Math.max(-4e4,Math.min(9e4,i))}function zt(i){return 24+34*Math.max(0,Math.min(1,(i+8e3)/4e4))+(i>400&&i<3400?6:0)}function ki(i,e){let t=[],n=i.length;for(let s=0;s<n-1;s++){let r=i[Math.max(0,s-1)],a=i[s],o=i[s+1],l=i[Math.min(n-1,s+2)],c=Math.hypot(o[0]-a[0],o[1]-a[1]),h=Math.max(1,Math.ceil(c/e));for(let p=0;p<h;p++){let u=p/h,m=u*u,v=m*u,g=(f,d,x,M)=>.5*(2*d+(-f+x)*u+(2*f-5*d+4*x-M)*m+(-f+3*d-3*x+M)*v);t.push([g(r[0],a[0],o[0],l[0]),g(r[1],a[1],o[1],l[1])])}}return t.push(i[n-1]),t}function Gi(i){let e=[0];for(let t=1;t<i.length;t++)e.push(e[t-1]+Math.hypot(i[t][0]-i[t-1][0],i[t][1]-i[t-1][1]));return{pts:i,cum:e,length:e[e.length-1]}}function kt(i,e){let{pts:t,cum:n}=i;e=Math.max(0,Math.min(i.length,e));let s=0,r=n.length-1;for(;r-s>1;){let m=s+r>>1;n[m]<=e?s=m:r=m}let a=n[r]-n[s]||1,o=(e-n[s])/a,l=t[s],c=t[r],h=c[0]-l[0],p=c[1]-l[1],u=Math.hypot(h,p)||1;return{p:[l[0]+h*o,l[1]+p*o],t:[h/u,p/u]}}var _s=Gi(ki(fv,40)),ys=Gi(ki(dv,40));function jn(i,e){let t=0;for(let[n,s,r,a,o]of pv){let l=((i-n)/r)**2+((e-s)/a)**2;t=Math.max(t,o*Math.max(0,1-l))}return Math.min(1,t*1.6)}function Lo(i){return i-Math.floor(i)}function Fo(i,e){let t=Lo(i*.1031),n=Lo(e*.1031),s=Lo(i*.1031),r=t*(n+33.33)+n*(s+33.33)+s*(t+33.33);return t+=r,n+=r,s+=r,Lo((t+n)*s)}function Vi(i,e){let t=Math.floor(i),n=Math.floor(e),s=i-t,r=e-n,a=s*s*(3-2*s),o=r*r*(3-2*r),l=Fo(t,n),c=Fo(t+1,n),h=Fo(t,n+1),p=Fo(t+1,n+1);return l+(c-l)*a+(h-l)*o+(l-c-h+p)*a*o}function Ou(i,e,t){let n=0,s=.5,r=0;for(let a=0;a<t;a++)n+=s*Vi(i,e),r+=s,i=i*2.03+17.1,e=e*2.03+9.7,s*=.5;return n/r}function No(i){let e=i>>>0||1;return()=>(e^=e<<13,e>>>=0,e^=e>>>17,e^=e<<5,e>>>=0,e/4294967296)}var Uo=1e20;function Bu(i,e,t,n,s){let r=0;n[0]=0,s[0]=-Uo,s[1]=Uo;for(let a=1;a<e;a++){let o=(i[a]+a*a-(i[n[r]]+n[r]*n[r]))/(2*a-2*n[r]);for(;o<=s[r];)r--,o=(i[a]+a*a-(i[n[r]]+n[r]*n[r]))/(2*a-2*n[r]);r++,n[r]=a,s[r]=o,s[r+1]=Uo}r=0;for(let a=0;a<e;a++){for(;s[r+1]<a;)r++;let o=a-n[r];t[a]=o*o+i[n[r]]}}function fc(i,e,t){let n=new Float32Array(e*t);for(let c=0;c<e*t;c++)n[c]=i[c]?0:Uo;let s=Math.max(e,t),r=new Float32Array(s),a=new Float32Array(s),o=new Int32Array(s),l=new Float32Array(s+1);for(let c=0;c<e;c++){for(let h=0;h<t;h++)r[h]=n[h*e+c];Bu(r,t,a,o,l);for(let h=0;h<t;h++)n[h*e+c]=a[h]}for(let c=0;c<t;c++){for(let h=0;h<e;h++)r[h]=n[c*e+h];Bu(r,e,a,o,l);for(let h=0;h<e;h++)n[c*e+h]=Math.sqrt(a[h])}return n}function mv(i,e,t){let{x0:n,z0:s,size:r,res:a}=e,o=r/a;for(let l=0;l<t.length-1;l++){let[c,h]=t[l],[p,u]=t[l+1],m=Math.hypot(p-c,u-h),v=Math.max(1,Math.ceil(m/(o*.4)));for(let g=0;g<=v;g++){let f=g/v,d=c+(p-c)*f,x=h+(u-h)*f,M=Math.floor((d-n)/o),b=Math.floor((x-s)/o);M>=0&&b>=0&&M<a&&b<a&&(i[b*a+M]=1)}}}function dc(i,e){let t=new Uint8Array(i.res*i.res);mv(t,i,e.pts);let n=fc(t,i.res,i.res),s=i.size/i.res;for(let r=0;r<n.length;r++)n[r]=Math.min(n[r]*s,1e6);return n}function pc(i,e,t,n){let s=new Uint8Array(i.length);for(let l=0;l<i.length;l++)s[l]=i[l]?0:1;let r=fc(i,e,t),a=fc(s,e,t),o=new Float32Array(i.length);for(let l=0;l<i.length;l++)o[l]=(i[l]?-(a[l]-.5):r[l]-.5)*n;return o}var gv=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;function mc(i,e){let t=new Rn(i,e,e,Ii,Vt);return t.minFilter=xt,t.magFilter=xt,t.wrapS=t.wrapT=Yt,t.needsUpdate=!0,t}function vv(i,e,t,n,s){let r=e.res,a=mc(t,r),o=mc(n,r),l=new Ge({vertexShader:gv,fragmentShader:bt+`
`+Lu,uniforms:{tRiverD:{value:a},tRailD:{value:o},uGrid:{value:new Je(e.x0,e.z0,e.size,e.res)},uIsFar:{value:s?1:0}},depthTest:!1,depthWrite:!1}),c=new Zt,h=new We(gi(),l);h.frustumCulled=!1,c.add(h);let p=new yt(r,r,{type:Ut,format:Mt,depthBuffer:!1}),u=new cn(-1,1,1,-1,0,1);i.setRenderTarget(p),i.render(c,u);let m=new Uint8Array(r*r*4);i.readRenderTargetPixels(p,0,0,r,r,m),i.setRenderTarget(null);let v=new Float32Array(r*r);for(let g=0;g<r*r;g++){let f=m[g*4]*65536+m[g*4+1]*256+m[g*4+2];v[g]=f/16777215*3e3-1e3}return p.dispose(),l.dispose(),a.dispose(),o.dispose(),v}function xv(i,e,t){let n=new Uint8Array(e*e*4);for(let r=0;r<e;r++)for(let a=0;a<e;a++){let o=Math.max(0,a-1),l=Math.min(e-1,a+1),c=Math.max(0,r-1),h=Math.min(e-1,r+1),p=(i[r*e+l]-i[r*e+o])/((l-o)*t),u=(i[h*e+a]-i[c*e+a])/((h-c)*t),m=Math.hypot(p,1,u),v=(r*e+a)*4;n[v]=Math.round((-p/m*.5+.5)*255),n[v+1]=Math.round(1/m*255),n[v+2]=Math.round((-u/m*.5+.5)*255),n[v+3]=255}let s=new Rn(n,e,e,Mt,Ut);return s.minFilter=et,s.magFilter=et,s.generateMipmaps=!1,s.needsUpdate=!0,s}function _v(i,e,t){let n=new Uint16Array(t*t*2);for(let r=0;r<t*t;r++)n[r*2]=us.toHalfFloat(Math.min(i[r],6e4)),n[r*2+1]=us.toHalfFloat(Math.min(e[r],6e4));let s=new Rn(n,t,t,Kn,Pt);return s.minFilter=et,s.magFilter=et,s.needsUpdate=!0,s}function zu(i,e,t){let n=dc(e,_s),s=dc(e,ys),r=vv(i,e,n,s,t);return{grid:e,h:r,river:n,rail:s,texH:mc(r,e.res),texN:xv(r,e.res,e.size/e.res),texD:_v(n,s,e.res)}}function Ms(i,e,t,n){let s=e.size/e.res,r=(t-e.x0)/s-.5,a=(n-e.z0)/s-.5;r=Math.max(0,Math.min(e.res-1.001,r)),a=Math.max(0,Math.min(e.res-1.001,a));let o=Math.floor(r),l=Math.floor(a),c=r-o,h=a-l,p=e.res,u=i[l*p+o],m=i[l*p+o+1],v=i[(l+1)*p+o],g=i[(l+1)*p+o+1];return u+(m-u)*c+(v-u)*h+(u-m-v+g)*c*h}var Oo=class{constructor(e){this.near=zu(e,Fu,!1),this.far=zu(e,Nu,!0)}nearWeight(e,t){let n=this.near.grid,s=Math.min(e-n.x0,n.x0+n.size-e,t-n.z0,n.z0+n.size-t);if(s<=0)return 0;let r=Math.min(1,s/800);return r*r*(3-2*r)}height(e,t){let n=this.nearWeight(e,t),s=Ms(this.far.h,this.far.grid,e,t);if(n<=0)return s;let r=Ms(this.near.h,this.near.grid,e,t);return s+(r-s)*n}riverDist(e,t){return this.nearWeight(e,t)>.5?Ms(this.near.river,this.near.grid,e,t):Ms(this.far.river,this.far.grid,e,t)}railDist(e,t){return this.nearWeight(e,t)>.5?Ms(this.near.rail,this.near.grid,e,t):Ms(this.far.rail,this.far.grid,e,t)}slope(e,t){let s=(this.height(e+6,t)-this.height(e-6,t))/12,r=(this.height(e,t+6)-this.height(e,t-6))/12;return Math.hypot(s,r)}};var ku=`// ===== \u8FD1\u666F\uFF08\u7C73\u5236\uFF09\u516C\u5171\u5149\u7167\uFF1A\u73AF\u5883\u5149\u3001\u955C\u5149\u3001\u5BF9\u5CB8\u5149\u3001\u6052\u661F\u659C\u5149\u3001\u4E91\u5F71\u3001\u9634\u5F71\u3001\u8DEF\u706F\u3001\u7A7A\u6C14\u900F\u89C6\u3001\u6CB3\u8C37\u96FE =====
// \u4F9D\u8D56\uFF1Acommon.glsl\u3001atmos.glsl\u3001clouds.glsl
uniform sampler2D tEnv;
uniform sampler2D tShadowKey;
uniform mat4 uShadowKeyMat;
uniform float uShadowKeyOn;
uniform vec2 uShadowKeyTexel;
uniform sampler2D tShadowStar;
uniform mat4 uShadowStarMat;
uniform float uShadowStarOn;
uniform vec2 uShadowStarTexel;
uniform sampler2D tTown;
uniform vec4 uTownGrid;
uniform float uNight;
uniform float uWet;
uniform vec2 uWind;
uniform float uTimeS;
uniform float uFogTop;
uniform float uPixAng;
uniform vec3 uStarGround;

#ifdef USE_LOGDEPTHBUF
uniform float logDepthBufFC;
varying float vFragDepth;
#endif

#ifdef SHADOW_PASS
uniform mat4 uShadowPassMat;
float shadowPassDepth(vec3 w) {
  vec4 c = uShadowPassMat * vec4(w, 1.0);
  return c.z / c.w * 0.5 + 0.5;
}
#define SHADOW_OUT(w) gl_FragColor = vec4(shadowPassDepth(w), 0.0, 0.0, 1.0); return;
#else
#define SHADOW_OUT(w)
#endif

vec2 equirectUV(vec3 d) {
  return vec2(atan(d.x, -d.z) / TAU + 0.5, asin(clamp(d.y, -1.0, 1.0)) / PI + 0.5);
}
vec3 envDiffuse(vec3 n) {
  // \u4F4E\u5C42 mip \u8FD1\u4F3C\u6F2B\u53CD\u5C04\u8F90\u7167\u5EA6\uFF1B\u5411\u4E0B\u7684\u90E8\u5206\u4EE5\u5730\u9762\u53CD\u7167\u8FD1\u4F3C
  vec3 up = textureLod(tEnv, equirectUV(normalize(vec3(n.x, max(n.y, 0.05), n.z))), 5.2).rgb;
  float g = sat(-n.y * 0.5 + 0.5);
  vec3 ground = (uMirrorE * 0.06 + uArchE * 0.05) * vec3(0.8, 0.9, 0.7);
  return mix(up * PI * 0.92, ground * PI, g * 0.85);
}
vec3 envSpec(vec3 r, float rough) {
  r.y = max(r.y, 0.002);
  return textureLod(tEnv, equirectUV(normalize(r)), rough * 5.5).rgb;
}

float riverLevelM(float x) { return -63.0 - 0.00025 * clamp(x, -40000.0, 90000.0); }
float riverHalfWM(float x) {
  float t = clamp((x + 8000.0) / 40000.0, 0.0, 1.0);
  return 24.0 + 34.0 * t + ((x > 400.0 && x < 3400.0) ? 6.0 : 0.0);
}

float townDensityM(vec2 p) {
  float d = 0.0;
  d = max(d, 1.0 * max(0.0, 1.0 - sq((p.x - 1500.0) / 1500.0) - sq((p.y - 120.0) / 520.0)));
  d = max(d, 0.85 * max(0.0, 1.0 - sq((p.x - 2600.0) / 900.0) - sq((p.y - 500.0) / 520.0)));
  d = max(d, 0.75 * max(0.0, 1.0 - sq((p.x - 1600.0) / 900.0) - sq((p.y - 1050.0) / 300.0)));
  d = max(d, 0.9 * max(0.0, 1.0 - sq((p.x - 900.0) / 520.0) - sq((p.y + 330.0) / 200.0)));
  return min(1.0, d * 1.6);
}

// \u9547\u533A\u7EB9\u7406\uFF1Ar=\u9053\u8DEF\u8DDD\u79BB\u573A\uFF0Cg=\u94FA\u88C5\u8DDD\u79BB\u573A\uFF0Cb=\u8DEF\u706F\u5149\uFF0Ca=\u7EFF\u5730
vec4 townTex(vec2 p) {
  vec2 uv = (p - uTownGrid.xy) / uTownGrid.z;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(1.0, 1.0, 0.0, 0.0);
  return texture(tTown, uv);
}
float roadSDF(vec4 t) { return (t.r - 0.5) * 32.0; }
float paveSDF(vec4 t) { return (t.g - 0.5) * 32.0; }

float pcf(sampler2D tex, vec2 uv, float d, vec2 texel, float radius) {
  float s = 0.0;
  const vec2 P[8] = vec2[8](vec2(-0.613, 0.617), vec2(0.17, -0.94), vec2(0.91, 0.32), vec2(-0.87, -0.42),
                            vec2(0.38, 0.79), vec2(-0.25, -0.31), vec2(0.6, -0.55), vec2(-0.4, 0.15));
  for (int i = 0; i < 8; i++) {
    float z = texture(tex, uv + P[i] * texel * radius).r;
    s += d <= z ? 1.0 : 0.0;
  }
  return s / 8.0;
}

float keyShadow(vec3 w, vec3 n) {
  if (uShadowKeyOn < 0.5) return 1.0;
  vec4 c = uShadowKeyMat * vec4(w + n * 0.35, 1.0);
  vec3 s = c.xyz / c.w;
  vec2 uv = s.xy * 0.5 + 0.5;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 1.0;
  float d = s.z * 0.5 + 0.5 - 0.0004;
  // \u955C\u4E91\u662F\u4E00\u5927\u7247\u5149\u6E90\uFF1A\u5F71\u5B50\u8FB9\u7F18\u67D4\u548C
  return pcf(tShadowKey, uv, d, uShadowKeyTexel, 2.4);
}

float starShadow(vec3 w, vec3 n) {
  if (uShadowStarOn < 0.5) return 1.0;
  vec4 c = uShadowStarMat * vec4(w + n * 0.6, 1.0);
  vec3 s = c.xyz / c.w;
  vec2 uv = s.xy * 0.5 + 0.5;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 1.0;
  float d = s.z * 0.5 + 0.5 - 0.0006;
  return pcf(tShadowStar, uv, d, uShadowStarTexel, 1.5);
}

// \u5730\u9762\u4E0A\u4E00\u70B9\u5F97\u5230\u7684\u6052\u661F\u5149\uFF08\u542B\u5357\u5899\u906E\u6321\u6BD4\u4F8B\u4E0E\u4F4E\u89D2\u5EA6\u5927\u6C14\u6D88\u5149\uFF09
vec3 starLightAt(vec3 w) {
  if (uStarE.r <= 0.0) return vec3(0.0);
  float vis = starVisAt(w.z * 0.001, max(w.y * 0.001, 0.0));
  if (vis <= 0.0) return vec3(0.0);
  vec3 T = exp(-tauUp(max(w.y * 0.001, 0.0)) / max(uStarDir.y + 0.015, 0.03));
  float cloud = 1.0 - 0.85 * uCloudCover * (0.4 + 0.6 * uStratus);
  // \u9732\u51FA\u7684\u53EA\u662F\u4E00\u7EBF\u4E0A\u7F18\uFF0C\u771F\u5B9E\u7167\u5EA6\u5F88\u5F31\uFF1B\u8FD9\u91CC\u653E\u5927\u6570\u500D\uFF0C\u8BA9\u4F4E\u659C\u7684\u5149\u4E0E\u957F\u5F71\u770B\u5F97\u51FA\u6765
  return uStarE * T * vis * cloud * 12.0;
}

vec3 lampLight(vec3 w) {
  if (uNight < 0.05) return vec3(0.0);
  float l = townTex(w.xz).b;
  l = l * l;
  return vec3(1.0, 0.7, 0.42) * l * 0.0022 * smoothstep(0.05, 0.35, uNight);
}

// \u4E0D\u900F\u660E\u8868\u9762\u7684\u603B\u5149\u7167\uFF08\u8FD4\u56DE\u51FA\u5C04\u8F90\u4EAE\u5EA6\uFF09
vec3 shade(vec3 alb, vec3 n, vec3 w, float ao, float rough, float wet, float cs, float ks) {
  vec3 V = normalize(cameraPosition - w);
  // \u955C\u5149\uFF1A\u8FD1\u5929\u9876\u7684\u5927\u9762\u79EF\u5149\u6E90
  float nd = max(dot(n, uMirrorDir), 0.0);
  vec3 col = alb * uMirrorE * nd * ks * cs / PI;
  // \u5BF9\u5CB8\u5149\uFF1A\u540C\u6837\u6765\u81EA\u5934\u9876\u4E00\u4FA7
  float na = max(dot(n, uArchDir), 0.0) * 0.85 + 0.15;
  col += alb * uArchE * na * mix(1.0, ks, 0.6) / PI;
  // \u5929\u7A7A\u6F2B\u5C04
  col += alb * envDiffuse(n) * ao / PI;
  // \u6052\u661F\u659C\u5149
  vec3 sl = starLightAt(w);
  if (sl.r > 0.0) col += alb * sl * max(dot(n, uStarDir), 0.0) * starShadow(w, n) / PI;
  // \u8DEF\u706F
  col += alb * lampLight(w) * ao;
  // \u6E7F\u6DA6\u65F6\u7684\u955C\u9762\u53CD\u5C04
  float F = 0.02 + 0.98 * pow(1.0 - max(dot(n, V), 0.0), 5.0);
  float specAmt = mix(0.04, 0.9, wet) * (1.0 - rough * 0.8);
  vec3 R = reflect(-V, n);
  col += envSpec(R, mix(rough, 0.05, wet)) * F * specAmt * ao;
  return col;
}

// \u6CB3\u8C37\u96FE\uFF1A\u6CBF\u89C6\u7EBF\u5728\u96FE\u5C42\uFF08\u6CB3\u9762\u4EE5\u4E0A uFogTop \u7C73\uFF09\u5185\u79EF\u5206
vec4 valleyFog(vec3 c, vec3 w) {
  if (uFogNow < 0.01) return vec4(0.0, 0.0, 0.0, 1.0);
  float top = riverLevelM(0.5 * (c.x + w.x)) + uFogTop;
  float t0 = 0.0, t1 = 1.0;
  if (c.y > top) {
    if (w.y > top) return vec4(0.0, 0.0, 0.0, 1.0);
    t0 = (c.y - top) / max(c.y - w.y, 1e-3);
  } else if (w.y > top) {
    t1 = (top - c.y) / max(w.y - c.y, 1e-3);
  }
  float L = length(w - c) * (t1 - t0);
  float tau = 0.0;
  vec3 glow = vec3(0.0);
  vec2 drift = uWind * uTimeS * 0.35;
  for (int i = 0; i < 6; i++) {
    float t = mix(t0, t1, (float(i) + 0.5) / 6.0);
    vec3 q = mix(c, w, t);
    float hr = q.y - riverLevelM(q.x);
    float n = vnoise2((q.xz - drift) / 260.0) * 0.55 + vnoise2((q.xz - drift * 1.3) / 80.0) * 0.3 + vnoise2((q.xz - drift * 1.7) / 23.0) * 0.15;
    // \u96FE\u5C42\u4E0A\u90E8\u7A00\u8584\u3001\u6210\u7F15\uFF0C\u4E0B\u90E8\u6D53
    float top = uFogTop * (0.75 + 0.5 * n);
    float dens = uFogNow * 0.011 * smoothstep(top, top * 0.2, hr) * smoothstep(0.25, 0.75, n + 0.25 * (1.0 - hr / uFogTop));
    tau += dens * L / 6.0;
    glow += lampLight(q) * dens;
  }
  float T = exp(-tau);
  vec3 fogL = (uMirrorE * 0.42 * underCloudLightA(0.0) + uAmbSky * 0.8 + uArchE * 0.9 + uStarGround * 0.15) / PI * vec3(0.95, 0.97, 1.0);
  // \u96FE\u4E2D\u7684\u8DEF\u706F\u5149\u6655
  vec3 lampFog = glow * (L / 6.0) * 0.35 * exp(-tau * 0.5);
  return vec4(fogL * (1.0 - T) + lampFog, T);
}

// \u7A7A\u6C14\u900F\u89C6 + \u6CB3\u8C37\u96FE
vec3 applyAtmos(vec3 col, vec3 w) {
  vec3 camK = cameraPosition * 0.001;
  vec3 pK = w * 0.001;
  vec3 ins;
  vec3 T = aerial(camK, pK, ins);
  col = col * T + ins;
  vec4 f = valleyFog(cameraPosition, w);
  return col * f.a + f.rgb;
}
`;var Gu=`// ===== \u5730\u5F62\u9876\u70B9\uFF1A\u6781\u5750\u6807\u7F51\u683C\u6309\u9AD8\u7A0B\u56FE\u62AC\u5347\uFF0C\u5E76\u52A0\u4E0A\u73AF\u9762\u5411\u4E0A\u5F2F\u8D77\u7684\u66F2\u7387 =====
uniform sampler2D tHN;
uniform sampler2D tHF;
uniform vec4 uGridN;
uniform vec4 uGridF;
varying vec3 vW;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif

float texH(sampler2D t, vec4 g, vec2 p) {
  vec2 uv = (p - g.xy) / g.z * g.w - 0.5;
  vec2 i = floor(uv);
  vec2 f = uv - i;
  int R = int(g.w) - 1;
  ivec2 i0 = clamp(ivec2(i), ivec2(0), ivec2(R));
  ivec2 i1 = clamp(ivec2(i) + 1, ivec2(0), ivec2(R));
  float a = texelFetch(t, ivec2(i0.x, i0.y), 0).r;
  float b = texelFetch(t, ivec2(i1.x, i0.y), 0).r;
  float c = texelFetch(t, ivec2(i0.x, i1.y), 0).r;
  float d = texelFetch(t, ivec2(i1.x, i1.y), 0).r;
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float nearWeight(vec2 p) {
  vec2 lo = uGridN.xy;
  vec2 hi = uGridN.xy + uGridN.z;
  float m = min(min(p.x - lo.x, hi.x - p.x), min(p.y - lo.y, hi.y - p.y));
  return smoothstep(0.0, 800.0, m);
}

float terrainHeight(vec2 p) {
  float w = nearWeight(p);
  float hf = texH(tHF, uGridF, p);
  if (w <= 0.0) return hf;
  float hn = texH(tHN, uGridN, p);
  return mix(hf, hn, w);
}

void main() {
  vec2 p = position.xz;
  float h = terrainHeight(p);
  // \u89C2\u5BDF\u70B9\u9644\u8FD1\u7684\u5FAE\u5730\u5F62
  float r = length(p);
  if (r < 260.0) h += (vnoise2(p * 0.33) - 0.5) * 0.22 * (1.0 - smoothstep(50.0, 260.0, r));
  vW = vec3(p.x, h, p.y);
  vec3 wp = vec3(p.x, h + p.x * p.x * 1.0e-8, p.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
`;var Vu=`// ===== \u5730\u5F62\u7740\u8272\uFF1A\u8349\u5730\u3001\u6797\u51A0\u3001\u7530\u5757\u3001\u9547\u533A\u3001\u6821\u56ED\u3001\u6CB3\u5CB8\u3001\u94C1\u8DEF =====
uniform sampler2D tNN;
uniform sampler2D tNF;
uniform sampler2D tDN;
uniform sampler2D tDF;
uniform vec4 uGridN;
uniform vec4 uGridF;
uniform vec4 uSeasonA; // \u53F6\u91CF\u3001\u79CB\u8272\u3001\u67AF\u9EC4\u3001\u65B0\u7EFF
uniform vec4 uSeasonB; // \u91D1\u9EC4\u3001\u7A7A\u7530\u3001\u6CB9\u83DC\u82B1\u3001\u51B7\u6696
uniform vec4 uSeasonC; // \u7A3B\uFF1A\u704C\u6C34\u3001\u9752\u3001\u9EC4\uFF1B\u51AC\u5C0F\u9EA6\u9752
uniform vec4 uSeasonD; // \u9EA6\u9EC4\u3001\u590F\u7389\u7C73\u3001\u82B1\u671F\u3001-
varying vec3 vW;

float nearW(vec2 p) {
  vec2 lo = uGridN.xy;
  vec2 hi = uGridN.xy + uGridN.z;
  float m = min(min(p.x - lo.x, hi.x - p.x), min(p.y - lo.y, hi.y - p.y));
  return smoothstep(0.0, 800.0, m);
}

vec3 decodeN(vec4 t) { return normalize(vec3(t.x * 2.0 - 1.0, t.y, t.z * 2.0 - 1.0)); }

// \u4E0E CPU \u7AEF\u4E00\u81F4\u7684\u6797\u5730\u5BC6\u5EA6
float forestDensity(vec2 p, float slopeT, float dr, float hRel, float town) {
  float n = fbm2(p / 700.0 + vec2(3.7, 1.9), 3) * 0.75 + vnoise2(p / 160.0) * 0.25;
  float hill = smoothstep(16.0, 60.0, hRel);
  float f = n + hill * 0.3 + min(slopeT, 0.6) * 0.55 - 0.5;
  f -= town * 1.3;
  f -= (1.0 - smoothstep(70.0, 160.0, dr)) * 0.6;
  return smoothstep(0.0, 0.1, f);
}

// \u7530\u5757
vec3 fieldColor(vec2 p, float px, out float rough, out float water, out float ridge) {
  float ang = 0.2 + 0.6 * (vnoise2(p / 2800.0) - 0.5);
  float ca = cos(ang), sa = sin(ang);
  vec2 q = vec2(ca * p.x + sa * p.y, -sa * p.x + ca * p.y);
  float rowH = 58.0;
  float row = floor(q.y / rowH);
  float off = hash12(vec2(row, 3.0)) * 300.0;
  float colW = 42.0 + 95.0 * hash12(vec2(row, 11.0));
  float col = floor((q.x + off) / colW);
  float id = hash12(vec2(row, col) + 0.5);
  float id2 = hash12(vec2(col, row) * 1.7 + 3.1);
  float fx = fract((q.x + off) / colW);
  float fy = fract(q.y / rowH);
  float ex = min(fx, 1.0 - fx) * colW;
  float ey = min(fy, 1.0 - fy) * rowH;
  float e = min(ex, ey);
  float aa = max(px, 0.05);
  // \u7530\u57C2\u5BBD\u7EA6 0.7 m\uFF1B\u50CF\u7D20\u8DB3\u8FF9\u53D8\u5927\u65F6\u9010\u6E10\u6DE1\u4E3A\u5E73\u5747\u8272\uFF0C\u907F\u514D\u6469\u5C14\u7EB9
  float ridgeFade = 1.0 - smoothstep(0.6, 3.0, px);
  ridge = (1.0 - smoothstep(0.35, 0.35 + aa * 1.5, e)) * ridgeFade + (1.0 - ridgeFade) * min(0.7 / colW + 0.7 / rowH, 0.5);
  // \u5784\u6C9F\u6761\u7EB9\uFF08\u53EA\u5728\u8FD1\u5904\u53EF\u89C1\uFF09
  float stripeK = 1.0 - smoothstep(0.5, 1.5, px);
  float stripe = stripeK * (0.5 + 0.5 * sin(q.y * 6.2832 / 0.9 + id * 40.0));
  water = 0.0;
  rough = 0.9;
  vec3 soil = vec3(0.15, 0.115, 0.08);
  vec3 c;
  if (id < 0.45) {
    // \u6C34\u7A3B\uFF1A\u4E94\u6708\u704C\u6C34\u63D2\u79E7\uFF0C\u590F\u5B63\u9752\u7EFF\uFF0C\u4E5D\u6708\u91D1\u9EC4\uFF0C\u6536\u5272\u540E\u7559\u832C
    vec3 green = mix(vec3(0.055, 0.12, 0.035), vec3(0.07, 0.16, 0.04), id2);
    vec3 gold = vec3(0.33, 0.255, 0.085);
    vec3 stubble = vec3(0.19, 0.155, 0.1);
    c = mix(soil * 1.1, stubble, 0.5);
    c = mix(c, vec3(0.035, 0.045, 0.045), uSeasonC.x);
    water = uSeasonC.x * (1.0 - 0.6 * uSeasonC.y);
    c = mix(c, green, uSeasonC.y);
    c = mix(c, gold, uSeasonC.z);
    c = mix(c, stubble, uSeasonB.y * (1.0 - uSeasonC.x) * (1.0 - uSeasonC.y));
    c *= 0.9 + 0.2 * stripe;
  } else if (id < 0.7) {
    if (id2 < 0.45) {
      // \u6CB9\u83DC\uFF1A\u51AC\u7EFF\uFF0C\u4E09\u56DB\u6708\u91D1\u9EC4\u7684\u82B1
      c = mix(soil, vec3(0.07, 0.11, 0.04), uSeasonC.w);
      c = mix(c, vec3(0.62, 0.5, 0.025), uSeasonB.z);
      c = mix(c, vec3(0.06, 0.13, 0.04), uSeasonD.y);
    } else {
      // \u51AC\u5C0F\u9EA6\u2014\u590F\u7389\u7C73
      c = mix(soil, vec3(0.065, 0.12, 0.04), uSeasonC.w);
      c = mix(c, vec3(0.37, 0.3, 0.12), uSeasonD.x);
      c = mix(c, vec3(0.05, 0.125, 0.032), uSeasonD.y);
    }
    c *= 0.88 + 0.24 * stripe;
  } else if (id < 0.85) {
    // \u83DC\u5730\uFF1A\u4E00\u7566\u4E00\u7566
    float bed = step(0.5, fract(q.y / 1.6 + id * 7.0));
    vec3 veg = mix(vec3(0.07, 0.13, 0.05), vec3(0.1, 0.14, 0.06), id2);
    veg = mix(veg, vec3(0.09, 0.1, 0.05), uSeasonA.z * 0.5);
    c = mix(soil, veg, mix(0.75, bed, stripeK));
  } else if (id < 0.93) {
    // \u679C\u56ED\uFF1A\u6210\u884C\u7684\u6811\u51A0
    vec2 g = fract(q / 5.0) - 0.5;
    float tree = 1.0 - smoothstep(0.25, 0.42, length(g));
    tree = mix(0.45, tree, stripeK);
    vec3 crown = mix(vec3(0.04, 0.08, 0.03), vec3(0.12, 0.09, 0.04), uSeasonA.y * 0.7);
    crown = mix(vec3(0.09, 0.08, 0.06), crown, uSeasonA.x);
    crown = mix(crown, vec3(0.5, 0.45, 0.45), uSeasonD.z * 0.6);
    c = mix(vec3(0.1, 0.13, 0.05), crown, tree);
  } else {
    // \u4F11\u8015\u5730 / \u7267\u8349
    c = mix(vec3(0.1, 0.14, 0.05), vec3(0.15, 0.13, 0.07), uSeasonA.z);
  }
  // \u7530\u57C2
  c = mix(c, mix(vec3(0.11, 0.13, 0.06), vec3(0.15, 0.13, 0.08), uSeasonA.z), ridge * 0.8);
  water *= 1.0 - ridge;
  return c;
}

// \u6821\u56ED\u5730\u9762\uFF1A\u8DD1\u9053\u3001\u8DB3\u7403\u573A\u3001\u7BEE\u7403\u573A
vec4 schoolSurface(vec2 p, float px) {
  // \u8FD4\u56DE rgb \u4E0E\u8986\u76D6\u5EA6
  if (p.x < 160.0 || p.x > 530.0 || p.y < -190.0 || p.y > 180.0) return vec4(0.0);
  float aa = max(px, 0.03);
  // \u6821\u56ED\uFF1A\u8349\u576A\u4E3A\u5E95\uFF0C\u5EFA\u7B51\u5468\u56F4\u4E0E\u4E3B\u8DEF\u662F\u94FA\u88C5
  vec3 lawnC = mix(vec3(0.07, 0.13, 0.04), vec3(0.09, 0.15, 0.05), vnoise2(p / 9.0));
  lawnC = mix(lawnC, vec3(0.13, 0.125, 0.07), uSeasonA.z * 0.7);
  vec3 paveC = vec3(0.23, 0.225, 0.21) * (0.92 + 0.1 * vnoise2(p * 0.5));
  float built = townTex(p).a;
  float walk = 1.0 - smoothstep(2.0, 2.0 + aa * 2.0, min(abs(p.y + 45.0), abs(p.x - 335.0)));
  walk = max(walk, (1.0 - smoothstep(2.5, 2.5 + aa * 2.0, abs(p.y - 120.0))) * step(170.0, p.x));
  vec3 c = mix(lawnC, paveC, max(smoothstep(0.15, 0.45, built), walk));
  // \u8DD1\u9053
  vec2 q = p - vec2(395.0, 52.0);
  float dStad = length(vec2(max(abs(q.x) - 42.2, 0.0), q.y));
  if (dStad < 47.0) {
    vec3 red = vec3(0.33, 0.085, 0.06);
    float onTrack = smoothstep(36.4 - aa, 36.4 + aa, dStad) * (1.0 - smoothstep(44.0 - aa, 44.0 + aa, dStad));
    // \u5206\u9053\u7EBF
    float lane = 0.0;
    for (int k = 0; k <= 6; k++) {
      float rk = 36.5 + 1.22 * float(k);
      lane = max(lane, 1.0 - smoothstep(0.025, 0.025 + aa, abs(dStad - rk)));
    }
    vec3 trackC = mix(red, vec3(0.62, 0.6, 0.58), lane * 0.85);
    // \u8DB3\u7403\u573A\uFF08\u4EBA\u9020\u8349\uFF09
    vec3 pitch = vec3(0.07, 0.165, 0.05) * (0.92 + 0.08 * step(0.5, fract(q.x / 10.0)));
    float lines = 0.0;
    vec2 a = abs(q);
    lines = max(lines, (1.0 - smoothstep(0.06, 0.06 + aa, abs(a.x - 50.0))) * step(a.y, 31.0));
    lines = max(lines, (1.0 - smoothstep(0.06, 0.06 + aa, abs(a.y - 31.0))) * step(a.x, 50.0));
    lines = max(lines, (1.0 - smoothstep(0.06, 0.06 + aa, abs(q.x))) * step(a.y, 31.0));
    lines = max(lines, 1.0 - smoothstep(0.06, 0.06 + aa, abs(length(q) - 9.15)));
    lines = max(lines, (1.0 - smoothstep(0.06, 0.06 + aa, abs(a.x - 33.5))) * step(a.y, 20.15) * step(33.5, a.x + 0.01));
    lines = max(lines, (1.0 - smoothstep(0.06, 0.06 + aa, abs(a.y - 20.15))) * step(33.5, a.x) * step(a.x, 50.0));
    pitch = mix(pitch, vec3(0.6), lines * 0.85);
    float inField = 1.0 - smoothstep(36.4 - aa, 36.4 + aa, dStad);
    vec3 cc = mix(c, trackC, onTrack);
    cc = mix(cc, pitch, inField);
    c = cc;
  }
  // \u7BEE\u7403\u573A\uFF1A\u4E24\u5757 28\xD715 m \u7684\u6807\u51C6\u573A\u5730
  vec2 b = p - vec2(232.0, 66.0);
  if (abs(b.x) < 18.0 && abs(b.y) < 19.0) {
    vec3 court = vec3(0.09, 0.2, 0.23);
    vec3 apron = vec3(0.16, 0.24, 0.2);
    vec2 cb = vec2(b.x, abs(b.y) - 9.0);
    vec2 a2 = abs(cb);
    float inC = step(a2.x, 14.0) * step(a2.y, 7.5);
    float l = 0.0;
    l = max(l, (1.0 - smoothstep(0.05, 0.05 + aa, abs(a2.x - 14.0))) * step(a2.y, 7.5));
    l = max(l, (1.0 - smoothstep(0.05, 0.05 + aa, abs(a2.y - 7.5))) * step(a2.x, 14.0));
    l = max(l, (1.0 - smoothstep(0.05, 0.05 + aa, abs(cb.x))) * step(a2.y, 7.5));
    l = max(l, 1.0 - smoothstep(0.05, 0.05 + aa, abs(length(cb) - 1.8)));
    l = max(l, (1.0 - smoothstep(0.05, 0.05 + aa, abs(a2.x - 8.2))) * step(a2.y, 2.45));
    l = max(l, (1.0 - smoothstep(0.05, 0.05 + aa, abs(a2.y - 2.45))) * step(8.2, a2.x) * step(a2.x, 14.0));
    l = max(l, (1.0 - smoothstep(0.05, 0.05 + aa, abs(length(vec2(14.0 - a2.x - 1.2, cb.y)) - 6.75))) * step(8.0, a2.x));
    vec3 cc = mix(apron, court, inC);
    c = mix(c, mix(cc, vec3(0.62), l * 0.85), step(abs(b.x), 17.0) * step(abs(b.y), 18.0));
  }
  float edge = smoothstep(160.0, 172.0, p.x) * (1.0 - smoothstep(520.0, 530.0, p.x)) * smoothstep(-190.0, -178.0, p.y) * (1.0 - smoothstep(170.0, 180.0, p.y));
  return vec4(c, edge);
}

void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  vec3 w = vW;
  vec2 p = w.xz;
  float camD = length(w - cameraPosition);
  SHADOW_OUT(w)
  // \u50CF\u7D20\u8DB3\u8FF9\uFF08\u7C73\uFF09\uFF0C\u7528\u4E8E\u6297\u952F\u9F7F\u4E0E\u7EC6\u8282\u6DE1\u51FA
  float px = camD * uPixAng / max(abs(normalize(cameraPosition - w).y), 0.08);
  float nw = nearW(p);
  vec3 N = decodeN(texture(tNF, (p - uGridF.xy) / uGridF.z));
  vec2 D = texture(tDF, (p - uGridF.xy) / uGridF.z).rg;
  if (nw > 0.0) {
    vec3 Nn = decodeN(texture(tNN, (p - uGridN.xy) / uGridN.z));
    vec2 Dn = texture(tDN, (p - uGridN.xy) / uGridN.z).rg;
    N = normalize(mix(N, Nn, nw));
    D = mix(D, Dn, nw);
  }
  float dr = D.x;
  float drl = D.y;
  float lvl = riverLevelM(p.x);
  float hw = riverHalfWM(p.x);
  float hRel = w.y - lvl;
  float slopeT = sqrt(max(1.0 - N.y * N.y, 0.0)) / max(N.y, 0.05);
  float town = townDensityM(p);
  float season = uSeasonA.x;

  // \u7EC6\u8282\u6CD5\u7EBF\uFF08\u8FD1\u5904\uFF09
  float detK = 1.0 - smoothstep(6.0, 60.0, px * 40.0);
  if (detK > 0.0) {
    float e = 0.4;
    float n0 = vnoise2(p * 1.3);
    float nx = vnoise2((p + vec2(e, 0.0)) * 1.3);
    float nz = vnoise2((p + vec2(0.0, e)) * 1.3);
    N = normalize(N + vec3(n0 - nx, 0.0, n0 - nz) * 0.9 * detK);
  }

  // ---------- \u57FA\u7840\uFF1A\u8349\u5730 ----------
  float gv = vnoise2(p / 37.0) * 0.6 + vnoise2(p / 9.0) * 0.4;
  vec3 grass = mix(vec3(0.075, 0.12, 0.04), vec3(0.11, 0.16, 0.05), gv);
  grass = mix(grass, vec3(0.13, 0.2, 0.055), uSeasonA.w * 0.6);
  grass = mix(grass, vec3(0.16, 0.14, 0.075), uSeasonA.z);
  vec3 alb = grass;
  float rough = 0.95;
  float waterLike = 0.0;
  float ao = 1.0;

  // ---------- \u6797\u51A0 ----------
  float forest = forestDensity(p, slopeT, dr, hRel, town);
  if (forest > 0.0) {
    float crown = vnoise2(p / 6.5) * 0.55 + vnoise2(p / 2.3) * 0.25 + vnoise2(p / 23.0) * 0.2;
    float evergreen = step(0.55, vnoise2(p / 90.0 + 7.0));
    vec3 leafC = mix(vec3(0.03, 0.06, 0.024), vec3(0.05, 0.085, 0.03), crown);
    leafC = mix(leafC, vec3(0.06, 0.1, 0.03), uSeasonA.w * 0.5);
    vec3 autumnC = mix(vec3(0.17, 0.07, 0.02), vec3(0.2, 0.15, 0.03), vnoise2(p / 14.0));
    vec3 decid = mix(leafC, autumnC, uSeasonA.y * 0.85);
    decid = mix(vec3(0.075, 0.065, 0.055) * (0.8 + 0.4 * crown), decid, sat((season - 0.12) / 0.88));
    vec3 conif = vec3(0.025, 0.045, 0.028) * (0.8 + 0.4 * crown);
    vec3 fc = mix(decid, conif, evergreen);
    // \u6797\u51A0\u7684\u660E\u6697\uFF1A\u6811\u51A0\u95F4\u7684\u7A7A\u9699\u66F4\u6697
    float gap = smoothstep(0.35, 0.15, crown);
    fc *= 1.0 - 0.45 * gap;
    alb = mix(alb, fc, forest);
    ao = mix(ao, 0.75, forest);
    rough = mix(rough, 1.0, forest);
  }

  // ---------- \u7530\u5757\uFF08\u8C37\u5E95\uFF09 ----------
  float fieldM = (1.0 - smoothstep(14.0, 26.0, hRel)) * (1.0 - smoothstep(0.08, 0.16, slopeT)) * (1.0 - forest) * smoothstep(hw + 30.0, hw + 70.0, dr) * (1.0 - smoothstep(0.05, 0.25, town));
  fieldM *= step(drl, 1e9);
  fieldM *= 1.0 - (1.0 - smoothstep(15.0, 30.0, drl)) * nw;
  if (fieldM > 0.0) {
    float fr, fw, ridge;
    vec3 fc = fieldColor(p, px, fr, fw, ridge);
    alb = mix(alb, fc, fieldM);
    rough = mix(rough, fr, fieldM);
    waterLike = max(waterLike, fw * fieldM);
  }

  // ---------- \u9547\u533A ----------
  vec4 tt = townTex(p);
  if (town > 0.0) {
    // \u9547\u4E0A\u7684\u7A7A\u5730\u591A\u662F\u83DC\u56ED\u3001\u8349\u5730\u4E0E\u6811\u836B\uFF1B\u5EFA\u7B51\u56DB\u5468\u662F\u6C34\u6CE5\u9662\u575D\u4E0E\u4EBA\u884C\u9053
    float yard = vnoise2(p / 14.0);
    vec3 garden = mix(vec3(0.075, 0.115, 0.04), vec3(0.11, 0.13, 0.055), yard);
    float veg = step(0.62, vnoise2(p / 6.0 + 3.0)) * (1.0 - smoothstep(0.3, 1.0, px));
    garden = mix(garden, mix(garden, vec3(0.13, 0.1, 0.07), 0.6), veg * 0.5);
    garden = mix(garden, vec3(0.14, 0.13, 0.075), uSeasonA.z * 0.6);
    vec3 yardPave = vec3(0.19, 0.18, 0.165) * (0.9 + 0.15 * vnoise2(p * 0.4));
    vec3 ground = mix(garden, yardPave, smoothstep(0.12, 0.5, tt.a));
    alb = mix(alb, ground, smoothstep(0.08, 0.3, town));
  }
  float pave = 1.0 - smoothstep(-0.3 - px, 0.3 + px, paveSDF(tt));
  alb = mix(alb, vec3(0.2, 0.195, 0.18) * (0.9 + 0.1 * vnoise2(p * 0.7)), pave);
  float road = 1.0 - smoothstep(-0.3 - px, 0.3 + px, roadSDF(tt));
  alb = mix(alb, vec3(0.055, 0.055, 0.06) * (0.9 + 0.2 * vnoise2(p * 0.3)), road);
  rough = mix(rough, 0.7, max(road, pave));

  // ---------- \u6821\u56ED ----------
  vec4 sc = schoolSurface(p, px);
  if (sc.a > 0.0) {
    alb = mix(alb, sc.rgb, sc.a);
    rough = mix(rough, 0.8, sc.a);
  }

  // ---------- \u94C1\u8DEF\u9053\u5E8A ----------
  if (nw > 0.0) {
    float bal = (1.0 - smoothstep(3.0, 3.6 + px, drl)) * nw;
    vec3 balC = vec3(0.16, 0.15, 0.14) * (0.85 + 0.3 * vnoise2(p * 3.0));
    alb = mix(alb, balC, bal);
    float shoulder = (1.0 - smoothstep(5.5, 9.0, drl)) * (1.0 - bal) * nw;
    alb = mix(alb, mix(alb, vec3(0.14, 0.13, 0.1), 0.6), shoulder);
  }

  // ---------- \u6CB3\u5CB8 ----------
  float bankZone = 1.0 - smoothstep(hw + 2.0, hw + 9.0 + px, dr);
  if (bankZone > 0.0) {
    float inTown = smoothstep(250.0, 450.0, p.x) * (1.0 - smoothstep(3200.0, 3500.0, p.x));
    vec3 mud = mix(vec3(0.13, 0.11, 0.085), vec3(0.2, 0.18, 0.15), vnoise2(p * 0.8));
    vec3 stone = vec3(0.23, 0.22, 0.2) * (0.85 + 0.25 * vnoise2(vec2(p.x * 0.5, w.y * 4.0)));
    alb = mix(alb, mix(mud, stone, inTown), bankZone);
    rough = mix(rough, 0.85, bankZone);
  }

  // ---------- \u6E7F\u6DA6 ----------
  float porous = 1.0 - road * 0.3;
  alb *= mix(1.0, 0.62, uWet * porous);
  float wet = max(uWet * (0.12 + 0.75 * max(road, pave)) * (1.0 - forest), waterLike);

  // ---------- \u5149\u7167 ----------
  float cs = cloudShadow(p * 0.001);
  float ks = keyShadow(vec3(p.x, w.y, p.y), N);
  vec3 col = shade(alb, N, w, ao, rough, wet, cs, ks);
  // \u6C34\u7530\u50CF\u955C\u5B50\u4E00\u6837\u6620\u51FA\u5929\u7A7A
  if (waterLike > 0.0) {
    vec3 V = normalize(cameraPosition - w);
    vec3 R = reflect(-V, vec3(0.0, 1.0, 0.0));
    float F = 0.02 + 0.98 * pow(1.0 - max(V.y, 0.0), 5.0);
    col = mix(col, envSpec(R, 0.02) * F + alb * 0.2 * (uMirrorE + uAmbSky) / PI, waterLike * 0.9);
  }
  col = applyAtmos(col, w);
  gl_FragColor = vec4(col, 1.0);
}
`;var tn=bt+`
`+xo+`
`+_o+`
`+ku+`
`;function Sv(i,e,t,n,s){let r=[],a=Math.pow(n/t,1/(e-1)),o=[];for(let c=0;c<e;c++)o.push(t*Math.pow(a,c));let l=i/s;for(let c=0;c<s;c++){let h=c*l,p=l+1,u=new Float32Array((e*p+1)*3),m=0;for(let w=0;w<e;w++)for(let C=0;C<p;C++){let _=(h+C)/i*Math.PI*2;u[m++]=Math.cos(_)*o[w],u[m++]=0,u[m++]=Math.sin(_)*o[w]}let v=e*p;u[m++]=0,u[m++]=0,u[m++]=0;let g=[];for(let w=0;w<e-1;w++)for(let C=0;C<l;C++){let _=w*p+C,S=_+1,U=_+p,R=U+1;g.push(_,S,U,S,R,U)}for(let w=0;w<l;w++)g.push(v,w+1,w);let f=new lt;f.setAttribute("position",new He(u,3)),f.setIndex(g);let d=(h+l/2)/i*Math.PI*2,x=l/i*Math.PI,M=n,b=new D(Math.cos(d)*M*.5,0,Math.sin(d)*M*.5),A=Math.hypot(M*.5,M*Math.sin(x))+2e3;f.boundingSphere=new St(b,A),r.push(f)}return r}function gc(i){let e=i.near,t=i.far;return new Ge({vertexShader:bt+`
`+Gu,fragmentShader:tn+Vu,uniforms:{...ce,...ut,tHN:{value:e.texH},tHF:{value:t.texH},tNN:{value:e.texN},tNF:{value:t.texN},tDN:{value:e.texD},tDF:{value:t.texD},uGridN:{value:new Je(e.grid.x0,e.grid.z0,e.grid.size,e.grid.res)},uGridF:{value:new Je(t.grid.x0,t.grid.z0,t.grid.size,t.grid.res)}}})}function Hu(i,e){let t=e>=2?768:e===1?512:384,n=e>=2?900:e===1?640:480,s=Sv(t,n,1,86e3,16),r=gc(i);return s.map(a=>{let o=new We(a,r);return o.matrixAutoUpdate=!1,o})}function ur(i){let e=_s,t=0,n=e.length;for(let r=0;r<40;r++){let a=(t+n)/2;kt(e,a).p[0]<i?t=a:n=a}let s=kt(e,(t+n)/2);return{z:s.p[1],tz:s.t[1]/Math.max(.001,s.t[0])}}function Hi(i){let e=ys,t=0,n=e.length;for(let s=0;s<40;s++){let r=(t+n)/2;kt(e,r).p[0]<i?t=r:n=r}return kt(e,(t+n)/2).p[1]}function vc(i,e,t,n=40){let s=[];for(let r=i;r<=e;r+=n){let a=ur(r),o=zt(r);s.push([r,a.z+Math.sign(t)*(o+Math.abs(t))])}return s}function Wu(i){let e=No(20240611),t=[],n=vc(-1400,5400,-24);t.push({pts:n,width:13,cls:"main"});let s=ki([n[n.length-1],[6600,760],[8200,900],[9800,860],[11400,1500],[13200,1820],[14800,2050],[16600,2500],[18400,2900]],60);t.push({pts:s,width:8,cls:"country"});let r=[];for(let k=540;k<=3300;k+=40)r.push([k,ur(k).z-zt(k)-200+30*Math.sin(k/700)]);t.push({pts:r,width:10,cls:"street"});let a=[];for(let k=560;k<=2900;k+=40)a.push([k,Hi(k)+44]);t.push({pts:a,width:11,cls:"main"}),t.push({pts:[[525,-45],[600,-45],[660,-60]],width:9,cls:"street"});let o=[];for(let k=660;k<3250;k+=120+e()*70)o.push(k);for(let k of o){let oe=Hi(k)+44,ue=ur(k).z-zt(k)-24,Me=(e()-.5)*40,he=[];for(let Se=0;Se<=10;Se++){let be=Se/10;he.push([k+Me*be+Math.sin(be*3+k)*4,oe+(ue-oe)*be])}t.push({pts:he,width:e()<.35?9:6.5,cls:e()<.35?"street":"lane"})}let l=1380,c=ur(l),h=zt(l),p=[l,c.z-h-24],u=[l+8,c.z+h+24];t.push({pts:[p,u],width:13,cls:"main"});let m=vc(650,3e3,26);t.push({pts:m,width:9,cls:"street"}),t.push({pts:ki([u,[1400,1250],[1520,1600],[1460,2e3],[1700,2500],[1980,3100],[2300,3500]],30),width:7.5,cls:"country"});for(let k=820;k<2900;k+=160+e()*80){let oe=ur(k).z+zt(k)+26;t.push({pts:[[k,oe],[k+(e()-.5)*30,oe+160+e()*120]],width:5.5,cls:"lane"})}t.push({pts:ki([[6,6],[40,30],[85,40],[130,22],[168,5]],6),width:2.4,cls:"path"}),t.push({pts:ki([[-8,-4],[-120,-60],[-300,-170],[-520,-330]],10),width:2.2,cls:"path"});let v=[];v.push({pts:vc(380,3300,-6),width:9}),v.push({pts:[[Bt.x-70,Hi(Bt.x)+30],[Bt.x+70,Hi(Bt.x)+30]],width:30}),v.push({pts:[[Bt.x-Bt.len/2,Hi(Bt.x)+12],[Bt.x+Bt.len/2,Hi(Bt.x)+12]],width:7}),v.push({pts:[[530,-45],[545,-45]],width:30});let g=ft.res,f=ft.size/g,d=document.createElement("canvas");d.width=g,d.height=g;let x=d.getContext("2d",{willReadFrequently:!0}),M=k=>[(k[0]-ft.x0)/f,(k[1]-ft.z0)/f],b=k=>{x.clearRect(0,0,g,g),x.strokeStyle="#fff",x.lineCap="round",x.lineJoin="round";for(let Me of k)x.lineWidth=Me.width/f,x.beginPath(),Me.pts.forEach((he,Se)=>{let[be,pe]=M(he);Se===0?x.moveTo(be,pe):x.lineTo(be,pe)}),x.stroke();let oe=x.getImageData(0,0,g,g).data,ue=new Uint8Array(g*g);for(let Me=0;Me<g*g;Me++)ue[Me]=oe[Me*4+3]>127?1:0;return ue},A=b(t),w=pc(A,g,g,f),C=b(v),_=pc(C,g,g,f),S=new Uint8Array(g*g);for(let k=0;k<g*g;k++)S[k]=A[k]|C[k];let U=[],R=(k,oe,ue,Me,he,Se)=>{let be=Math.cos(ue),pe=Math.sin(ue),De=Me/2+Se,P=he/2+Se;for(let it=-De;it<=De;it+=f*.9)for(let Ve=-P;Ve<=P;Ve+=f*.9){let je=k+be*it-pe*Ve,Ee=oe+pe*it+be*Ve,E=Math.floor((je-ft.x0)/f),y=Math.floor((Ee-ft.z0)/f);if(E<0||y<0||E>=g||y>=g||S[y*g+E])return!1}return!0},F=(k,oe,ue,Me,he)=>{let Se=Math.cos(ue),be=Math.sin(ue);for(let pe=-Me/2-1;pe<=Me/2+1;pe+=f*.7)for(let De=-he/2-1;De<=he/2+1;De+=f*.7){let P=k+Se*pe-be*De,it=oe+be*pe+Se*De,Ve=Math.floor((P-ft.x0)/f),je=Math.floor((it-ft.z0)/f);Ve>=0&&je>=0&&Ve<g&&je<g&&(S[je*g+Ve]=1)}},O=(k,oe,ue,Me,he)=>{let Se=Math.cos(ue),be=Math.sin(ue),pe=1/0;for(let[De,P]of[[-Me/2,-he/2],[Me/2,-he/2],[-Me/2,he/2],[Me/2,he/2],[0,0]])pe=Math.min(pe,i.height(k+Se*De-be*P,oe+be*De+Se*P));return pe},G=[[.62,.6,.55],[.7,.68,.62],[.55,.53,.5],[.66,.6,.5],[.58,.5,.42],[.72,.71,.68],[.5,.47,.44],[.64,.57,.47],[.6,.62,.6],[.68,.64,.58]],H=[[.12,.12,.13],[.16,.15,.15],[.3,.13,.08],[.24,.12,.08],[.1,.12,.15],[.2,.2,.21]],V=(k,oe)=>{if(!R(k.x,k.z,k.rot,k.w,k.d,oe)||i.riverDist(k.x,k.z)<zt(k.x)+Math.max(k.w,k.d)*.5+10||i.railDist(k.x,k.z)<Math.max(k.w,k.d)*.5+12||i.slope(k.x,k.z)>.22)return!1;let ue=O(k.x,k.z,k.rot,k.w,k.d);return U.push({...k,y:ue,seed:e()}),F(k.x,k.z,k.rot,k.w,k.d),!0},W=[{x:215,z:-102,rot:Math.PI/2,w:112,d:17,h:18.6,roof:0,wall:[.78,.77,.74],roofC:[.32,.31,.3],kind:2},{x:318,z:-140,rot:0,w:106,d:16,h:15.5,roof:0,wall:[.8,.78,.74],roofC:[.3,.3,.3],kind:2},{x:266,z:-60,rot:0,w:46,d:14,h:12.4,roof:0,wall:[.74,.72,.68],roofC:[.3,.3,.3],kind:2},{x:485,z:-112,rot:Math.PI/2,w:60,d:34,h:13,roof:1,wall:[.7,.71,.72],roofC:[.22,.32,.4],kind:3},{x:210,z:150,rot:0,w:70,d:15,h:15.5,roof:0,wall:[.76,.72,.66],roofC:[.3,.3,.3],kind:2},{x:306,z:152,rot:0,w:40,d:18,h:9.3,roof:1,wall:[.74,.72,.68],roofC:[.28,.13,.08],kind:3}];for(let k of W)V(k,-4);let re=Hi(Bt.x);V({x:Bt.x,z:re+27,rot:0,w:52,d:16,h:9,roof:1,wall:[.72,.7,.66],roofC:[.16,.2,.24],kind:3},-6);let se=t.filter(k=>k.cls!=="path"&&k.cls!=="country");for(let k of se){let oe=Gi(k.pts);for(let ue of[-1,1]){let Me=6+e()*10;for(;Me<oe.length-6;){let{p:he,t:Se}=kt(oe,Me),be=jn(he[0],he[1]);if(be<.08){Me+=25;continue}let pe=be>.75&&e()<.22,De=pe?26+e()*14:8+e()*8,P=pe?12+e()*4:9+e()*6,it=pe?5+Math.floor(e()*5):1+Math.floor(e()*(1+3*be)),Ve=k.width/2+3+e()*4+P/2,je=-Se[1]*ue,Ee=Se[0]*ue,E=he[0]+je*Ve,y=he[1]+Ee*Ve,N=Math.atan2(Se[1],Se[0]),j=G[Math.floor(e()*G.length)],Q=!pe&&e()<.72?1:0,K=H[Math.floor(e()*H.length)];if(e()<.9*Math.min(1,be*1.8)&&(V({x:E,z:y,rot:N,w:De,d:P,h:it*3.1+.4,roof:Q,wall:j,roofC:K,kind:pe?1:0},1.2),e()<be*.7)){let we=Ve+P/2+8+e()*8+5;V({x:he[0]+je*we,z:he[1]+Ee*we,rot:N+(e()-.5)*.08,w:8+e()*7,d:8+e()*5,h:(1+Math.floor(e()*3))*3.1+.4,roof:1,wall:G[Math.floor(e()*G.length)],roofC:H[Math.floor(e()*H.length)],kind:0},1.5)}Me+=De+2+e()*7}}}let ge=[[5200,380,26],[7300,2300,30],[9700,1250,34],[12500,1650,26],[15300,2600,18],[11300,3500,20],[2700,2350,18],[-2500,1650,16],[4300,-1100,14],[8600,-400,16],[6800,3600,12],[13900,600,16],[-1600,-1500,10],[19800,4500,22],[23800,3100,30],[28500,5800,26],[33e3,2500,30],[37e3,7e3,24]],ye=[];for(let[k,oe,ue]of ge){let Me=e()*Math.PI;for(let he=0;he<ue;he++){let Se=e()*Math.PI*2,be=Math.sqrt(e())*(60+ue*7),pe=k+Math.cos(Se)*be,De=oe+Math.sin(Se)*be;if(i.riverDist(pe,De)<zt(pe)+30||i.railDist(pe,De)<25||i.slope(pe,De)>.25)continue;let P=8+e()*7,it=8+e()*4,Ve=Me+(e()<.7?0:Math.PI/2)+(e()-.5)*.2;ye.push({x:pe,z:De,rot:Ve,w:P,d:it,y:i.height(pe,De)-.6,h:(1+Math.floor(e()*3))*3.1+.3,roof:e()<.85?1:0,wall:G[Math.floor(e()*G.length)],roofC:H[Math.floor(e()*H.length)],seed:e(),kind:0})}}U.push(...ye);let me=[];for(let k of t){if(k.cls==="path")continue;let oe=Gi(k.pts),ue=k.cls==="main"?32:k.cls==="country"?60:40,Me=1;for(let he=8;he<oe.length;he+=ue){let{p:Se,t:be}=kt(oe,he);if(k.cls==="country"&&jn(Se[0],Se[1])<.02&&e()<.75)continue;let pe=k.width/2+1.2,De=Se[0]-be[1]*pe*Me,P=Se[1]+be[0]*pe*Me;i.riverDist(De,P)<zt(De)+2&&Math.abs(De-l)>20||(me.push({x:De,z:P,y:i.height(De,P),h:k.cls==="main"?8.5:6.5}),k.cls!=="country"&&(Me=-Me))}}me.push({x:120,z:26,y:i.height(120,26),h:3.5}),me.push({x:60,z:38,y:i.height(60,38),h:3.5});for(let[k,oe]of[[300,-100],[380,-100],[450,-40],[230,40],[350,120]])me.push({x:k,z:oe,y:Uu.level,h:6});let Be=new Float32Array(g*g);for(let k of me){let oe=(k.x-ft.x0)/f,ue=(k.z-ft.z0)/f,Me=k.h*2.6/f,he=Math.ceil(Me*2);for(let Se=-he;Se<=he;Se++)for(let be=-he;be<=he;be++){let pe=Math.floor(oe)+be,De=Math.floor(ue)+Se;if(pe<0||De<0||pe>=g||De>=g)continue;let P=((pe+.5-oe)**2+(De+.5-ue)**2)/(Me*Me);Be[De*g+pe]+=Math.exp(-P*1.6)*(k.h>7?1:.7)}}let st=new Float32Array(g*g);for(let k of U){if(k.x<ft.x0||k.z<ft.z0||k.x>ft.x0+ft.size||k.z>ft.z0+ft.size)continue;let oe=Math.cos(k.rot),ue=Math.sin(k.rot),Me=k.kind===2?9:5;for(let he=-k.w/2-Me;he<=k.w/2+Me;he+=f*.7)for(let Se=-k.d/2-Me;Se<=k.d/2+Me;Se+=f*.7){let be=k.x+oe*he-ue*Se,pe=k.z+ue*he+oe*Se,De=Math.floor((be-ft.x0)/f),P=Math.floor((pe-ft.z0)/f);De>=0&&P>=0&&De<g&&P<g&&(st[P*g+De]=1)}}let rt=new Float32Array(g*g);for(let k=0;k<2;k++){for(let oe=0;oe<g;oe++)for(let ue=0;ue<g;ue++){let Me=0;for(let he=-2;he<=2;he++)Me+=st[oe*g+Math.min(g-1,Math.max(0,ue+he))];rt[oe*g+ue]=Me/5}for(let oe=0;oe<g;oe++)for(let ue=0;ue<g;ue++){let Me=0;for(let he=-2;he<=2;he++)Me+=rt[Math.min(g-1,Math.max(0,oe+he))*g+ue];st[oe*g+ue]=Me/5}}let Z=new Uint8Array(g*g*4);for(let k=0;k<g*g;k++)Z[k*4]=Math.max(0,Math.min(255,Math.round((w[k]/32+.5)*255))),Z[k*4+1]=Math.max(0,Math.min(255,Math.round((_[k]/32+.5)*255))),Z[k*4+2]=Math.max(0,Math.min(255,Math.round(Math.sqrt(Math.min(1,Be[k]))*255))),Z[k*4+3]=Math.round(Math.min(1,st[k])*255);let ae=new Rn(Z,g,g,Mt,Ut);ae.minFilter=et,ae.magFilter=et,ae.wrapS=ae.wrapT=Yt,ae.needsUpdate=!0;let fe=[{a:p,b:u,width:13,y:Math.max(i.height(p[0],p[1]),i.height(u[0],u[1]))}];return{roads:t,buildings:U,lamps:me,texture:ae,bridges:fe}}var xc=`// ===== \u5EFA\u7B51\uFF08\u5B9E\u4F8B\u5316\uFF09\uFF1A\u5899\u9762\u3001\u7A97\u3001\u5761\u5C4B\u9876 =====
// #define ROOF \u8868\u793A\u5761\u5C4B\u9876\u51E0\u4F55
#ifdef VERTEX
attribute vec4 iPos;    // x, y, z, rot
attribute vec4 iSize;   // w, h, d, roofType
attribute vec4 iWall;   // rgb, seed
attribute vec4 iRoof;   // rgb, kind
varying vec3 vW;
varying vec3 vN;
varying vec3 vLocal;    // \u5899\u9762\u5750\u6807\uFF1Au\uFF08\u7C73\uFF09\u3001v\uFF08\u7C73\uFF09\u3001\u9762\u7F16\u53F7
varying vec4 vWall;
varying vec4 vRoof;
varying vec3 vSize;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  float c = cos(iPos.w), s = sin(iPos.w);
  vec3 p = position;
  vec3 lp;
  vec3 n = normal;
#ifdef ROOF
  float roofH = iSize.z * 0.3;
  lp = vec3(p.x * (iSize.x + 0.7), iSize.y + p.y * roofH, p.z * (iSize.z + 0.9));
  // \u6CD5\u7EBF\u968F\u5C4B\u9876\u5761\u5EA6\u7F29\u653E
  n = normalize(vec3(n.x / (iSize.x + 0.7), n.y / roofH, n.z / (iSize.z + 0.9)));
  vLocal = vec3(p.x * iSize.x, (0.5 - abs(p.z)) * (iSize.z + 0.9), 0.0);
#else
  lp = vec3(p.x * iSize.x, p.y * iSize.y, p.z * iSize.z);
  float face = abs(n.x) > 0.5 ? 1.0 : (abs(n.z) > 0.5 ? 2.0 : 3.0);
  float u = face < 1.5 ? p.z * iSize.z : p.x * iSize.x;
  vLocal = vec3(u, p.y * iSize.y, face);
#endif
  vec3 wp = vec3(c * lp.x - s * lp.z, lp.y, s * lp.x + c * lp.z) + iPos.xyz;
  vN = vec3(c * n.x - s * n.z, n.y, s * n.x + c * n.z);
  vW = wp;
  vWall = iWall;
  vRoof = iRoof;
  vSize = iSize.xyz;
  vec3 cp = vec3(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z);
  gl_Position = projectionMatrix * viewMatrix * vec4(cp, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif

#ifdef FRAGMENT
varying vec3 vW;
varying vec3 vN;
varying vec3 vLocal;
varying vec4 vWall;
varying vec4 vRoof;
varying vec3 vSize;

// \u591C\u91CC\u7A97\u6237\u662F\u5426\u4EAE\u706F\uFF1A\u968F\u65F6\u95F4\u7F13\u6162\u53D8\u5316
float windowLit(vec2 id, float seed) {
  float h = uLocalHour;
  // \u5165\u591C\u540E\u4EAE\u706F\u7684\u6BD4\u4F8B\uFF1A\u508D\u665A\u591A\uFF0C\u6DF1\u591C\u5C11\uFF0C\u6E05\u6668\u53C8\u6709\u4E00\u4E9B
  float evening = smoothstep(17.5, 19.5, h) * (1.0 - smoothstep(22.5, 24.0, h));
  float late = (step(h, 5.5) * 0.12 + step(23.99, h) * 0.12) + smoothstep(0.0, 1.0, 1.0 - h) * 0.0;
  float dawn = smoothstep(5.0, 6.0, h) * (1.0 - smoothstep(7.0, 8.0, h));
  float frac = max(max(evening * 0.62, late), dawn * 0.35);
  frac = max(frac, step(19.5, h) * smoothstep(24.0, 22.0, h) * 0.5);
  float slot = floor(uTimeS / 1500.0 + hash12(id + seed * 7.0) * 3.0);
  float r = hash13(vec3(id, slot + seed * 13.0));
  return step(r, frac);
}

void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  vec3 N = normalize(vN);
  vec3 w = vW;
  float kind = vRoof.a;
  SHADOW_OUT(w)
  float seed = vWall.a;
  vec3 V = normalize(cameraPosition - w);
  float camD = length(cameraPosition - w);
  float px = camD * uPixAng;
  vec3 alb;
  vec3 emit = vec3(0.0);
  float rough = 0.85;
  float wet = uWet * 0.5;
  float glass = 0.0;
#ifdef ROOF
  // \u74E6\u5C4B\u9876\uFF1A\u6CBF\u5761\u5411\u7684\u74E6\u5784
  float row = vLocal.y;
  float tile = 0.85 + 0.15 * smoothstep(0.0, 0.3, abs(fract(row / 0.32) - 0.5)) * (1.0 - smoothstep(0.2, 0.6, px));
  float col = 0.9 + 0.1 * sin(vLocal.x * 18.0) * (1.0 - smoothstep(0.1, 0.4, px));
  alb = vRoof.rgb * tile * col * (0.85 + 0.3 * hash12(floor(vLocal.xy * vec2(0.5, 2.0)) + seed));
  // \u5C11\u6570\u5C4B\u9876\u88C5\u4E86\u592A\u9633\u80FD\u677F
  float solar = step(0.72, seed) * step(0.15, row) * step(row, vSize.z * 0.38) * step(abs(vLocal.x), vSize.x * 0.32);
  alb = mix(alb, vec3(0.03, 0.04, 0.07), solar);
  rough = mix(0.8, 0.3, solar);
  wet = uWet * 0.8;
  float ao = 1.0;
#else
  float face = vLocal.z;
  float ao = mix(0.55, 1.0, smoothstep(0.0, 2.5, vLocal.y));
  alb = vWall.rgb * (0.92 + 0.12 * vnoise2(vLocal.xy * vec2(0.4, 0.8) + seed * 50.0));
  // \u5899\u811A\u7684\u6C61\u8FF9
  alb *= mix(0.78, 1.0, smoothstep(0.2, 1.4, vLocal.y));
  if (face > 2.5) {
    // \u5E73\u9876
    alb = vec3(0.3, 0.29, 0.27) * (0.85 + 0.25 * vnoise2(w.xz * 0.5));
    ao = 1.0;
  } else {
    // \u7A97\u683C
    float floorH = 3.1;
    float fy = vLocal.y - 0.9;
    float floorI = floor(fy / floorH);
    float inFloor = fract(fy / floorH);
    float bayW = kind > 1.5 && kind < 2.5 ? 3.6 : (kind > 0.5 && kind < 1.5 ? 2.8 : 3.3);
    float bx = vLocal.x / bayW;
    float bayI = floor(bx);
    float inBay = fract(bx);
    float winW = kind > 1.5 && kind < 2.5 ? 0.78 : 0.48;
    float winH = kind > 1.5 && kind < 2.5 ? 0.62 : 0.5;
    float wx = smoothstep(0.5 - winW * 0.5 - 0.02, 0.5 - winW * 0.5, inBay) * (1.0 - smoothstep(0.5 + winW * 0.5, 0.5 + winW * 0.5 + 0.02, inBay));
    float wy = smoothstep(0.28 - 0.02, 0.28, inFloor) * (1.0 - smoothstep(0.28 + winH, 0.28 + winH + 0.02, inFloor));
    float edgeX = step((face < 1.5 ? vSize.z : vSize.x) * 0.5 - 0.9, abs(vLocal.x));
    float win = wx * wy * step(0.0, fy) * step(vLocal.y, vSize.y - 0.6) * (1.0 - edgeX);
    // \u8FDC\u5904\u50CF\u7D20\u592A\u5927\u65F6\u53D6\u7A97\u7684\u5E73\u5747\u8986\u76D6\u7387
    float far = smoothstep(0.25, 1.2, px);
    win = mix(win, winW * winH * step(0.9, vLocal.y) * step(vLocal.y, vSize.y - 0.6) * 0.9, far);
    // \u5B66\u6821\u7684\u8D70\u5ECA\u680F\u677F\uFF08\u767D\u8272\u6A2A\u5E26\uFF09
    if (kind > 1.5 && kind < 2.5) {
      float band = smoothstep(0.02, 0.0, abs(inFloor - 0.12) - 0.08);
      alb = mix(alb, vec3(0.86, 0.85, 0.82), band * (1.0 - far));
      // \u4E00\u70B9\u70B9\u6821\u8272\uFF1A\u84DD\u7070\u7A97\u6846
    }
    vec3 glassC = vec3(0.03, 0.035, 0.04);
    alb = mix(alb, glassC, win);
    glass = win;
    rough = mix(rough, 0.08, win);
    // \u591C\u706F
    vec2 wid = vec2(bayI + face * 101.0, floorI);
    float lit = windowLit(wid, seed);
    // \u5B66\u6821\uFF1A\u665A\u81EA\u4E60\u5230 21:30\uFF0C\u4E4B\u540E\u53EA\u5269\u96F6\u661F\u51E0\u76CF
    if (kind > 1.5 && kind < 2.5) lit *= (uLocalHour > 18.0 && uLocalHour < 21.5 ? 1.0 : 0.08);
    float warm = hash12(wid * 3.1 + seed);
    vec3 lc = warm < 0.7 ? vec3(1.0, 0.72, 0.46) : vec3(0.85, 0.9, 1.0);
    float bright = 0.0045 * (0.5 + hash12(wid + seed * 9.0));
    // \u8FDC\u5904\u5E73\u5747\uFF1A\u4EAE\u7A97\u6BD4\u4F8B \xD7 \u7A97\u9762\u79EF
    float litAvg = 0.45 * smoothstep(17.5, 20.0, uLocalHour) + 0.1;
    if (kind > 1.5 && kind < 2.5) litAvg *= (uLocalHour > 18.0 && uLocalHour < 21.5 ? 1.0 : 0.08);
    float litMix = mix(lit, litAvg, far);
    emit = lc * bright * win * litMix * smoothstep(0.15, 0.6, uNight);
    // \u4E00\u697C\u5E97\u9762\uFF08\u6CBF\u8857\u6C11\u5C45\uFF09
    if (kind < 0.5 && floorI < 0.5 && vSize.x > 9.0 && seed > 0.4) {
      float shop = smoothstep(0.1, 0.12, inFloor) * (1.0 - smoothstep(0.78, 0.8, inFloor)) * (1.0 - far * 0.5);
      alb = mix(alb, vec3(0.05, 0.05, 0.06), shop * 0.8);
      emit += vec3(1.0, 0.78, 0.55) * 0.006 * shop * step(uLocalHour, 22.0) * smoothstep(0.2, 0.6, uNight);
    }
  }
#endif
  alb *= mix(1.0, 0.7, uWet * (1.0 - glass));
  float cs = cloudShadow(w.xz * 0.001);
  float ks = keyShadow(w, N);
  vec3 colr = shade(alb, N, w, ao, rough, max(wet, glass), cs, ks);
  colr += emit;
  colr = applyAtmos(colr, w);
  gl_FragColor = vec4(colr, 1.0);
}
#endif
`;function Tv(){let i=[],e=[],t=(r,a,o,l,c)=>{i.push(...r,...a,...o,...r,...o,...l);for(let h=0;h<6;h++)e.push(...c)};t([.5,0,.5],[.5,0,-.5],[.5,1,-.5],[.5,1,.5],[1,0,0]),t([-.5,0,-.5],[-.5,0,.5],[-.5,1,.5],[-.5,1,-.5],[-1,0,0]),t([-.5,0,.5],[.5,0,.5],[.5,1,.5],[-.5,1,.5],[0,0,1]),t([.5,0,-.5],[-.5,0,-.5],[-.5,1,-.5],[.5,1,-.5],[0,0,-1]),t([-.5,1,.5],[.5,1,.5],[.5,1,-.5],[-.5,1,-.5],[0,1,0]);let s=new lt;return s.setAttribute("position",new He(new Float32Array(i),3)),s.setAttribute("normal",new He(new Float32Array(e),3)),s}function Av(){let i=[],e=[],n=(a,o,l,c)=>{i.push(...a,...o,...l);for(let h=0;h<3;h++)e.push(...c)};n([-.5,0,.5],[.5,0,.5],[.5,1,0],[0,.5,1]),n([-.5,0,.5],[.5,1,0],[-.5,1,0],[0,.5,1]),n([.5,0,-.5],[-.5,0,-.5],[-.5,1,0],[0,.5,-1]),n([.5,0,-.5],[-.5,1,0],[.5,1,0],[0,.5,-1]),n([.5,0,.5],[.5,0,-.5],[.5,1,0],[1,0,0]),n([-.5,0,-.5],[-.5,0,.5],[-.5,1,0],[-1,0,0]);let s=new lt;s.setAttribute("position",new He(new Float32Array(i),3));let r=new Float32Array(e);for(let a=0;a<r.length;a+=3){let o=Math.hypot(r[a],r[a+1],r[a+2]);r[a]/=o,r[a+1]/=o,r[a+2]/=o}return s.setAttribute("normal",new He(r,3)),s}function Xu(i,e){let t=new en;t.setAttribute("position",i.getAttribute("position")),t.setAttribute("normal",i.getAttribute("normal"));let n=e.length,s=new Float32Array(n*4),r=new Float32Array(n*4),a=new Float32Array(n*4),o=new Float32Array(n*4),l=1/0,c=-1/0,h=1/0,p=-1/0;e.forEach((m,v)=>{s.set([m.x,m.y,m.z,m.rot],v*4),r.set([m.w,m.h,m.d,m.roof],v*4),a.set([...m.wall,m.seed],v*4),o.set([...m.roofC,m.kind],v*4),l=Math.min(l,m.x),c=Math.max(c,m.x),h=Math.min(h,m.z),p=Math.max(p,m.z)}),t.setAttribute("iPos",new Rt(s,4)),t.setAttribute("iSize",new Rt(r,4)),t.setAttribute("iWall",new Rt(a,4)),t.setAttribute("iRoof",new Rt(o,4)),t.instanceCount=n;let u=new D((l+c)/2,0,(h+p)/2);return t.boundingSphere=new St(u,Math.hypot(c-l,p-h)/2+200),t}function qu(i){let e=i?`#define ROOF
`:"";return new Ge({vertexShader:`#define VERTEX
`+e+bt+`
`+xc,fragmentShader:`#define FRAGMENT
`+e+tn+xc,uniforms:{...ce,...ut}})}function Ku(i){let e=[],t=new We(Xu(Tv(),i.buildings),qu(!1));e.push(t);let n=i.buildings.filter(s=>s.roof>.5);n.length&&e.push(new We(Xu(Av(),n),qu(!0))),e.push(Ev(i));for(let s of i.bridges)e.push(Cv(s));return e}var Yu=`
#ifdef VERTEX
attribute vec4 iLamp; // x, y, z, h
attribute float part;
varying vec3 vW;
varying float vHead;
varying vec3 vN;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  vec3 p = position;
  vec3 lp = part < 0.5 ? vec3(p.x * 0.14, p.y * iLamp.w, p.z * 0.14) : vec3(p.x * 0.8 + 0.3, iLamp.w + p.y * 0.2, p.z * 0.34);
  vec3 wp = lp + iLamp.xyz;
  vW = wp;
  vHead = part;
  vN = normal;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif
#ifdef FRAGMENT
varying vec3 vW;
varying float vHead;
varying vec3 vN;
void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  SHADOW_OUT(vW)
  vec3 N = normalize(vN);
  vec3 alb = vec3(0.12, 0.12, 0.13);
  vec3 col = shade(alb, N, vW, 1.0, 0.5, uWet, 1.0, 1.0);
  float on = smoothstep(0.25, 0.55, uNight);
  col += vHead * vec3(1.0, 0.78, 0.5) * on * 0.5 * (N.y < -0.5 ? 1.0 : 0.15);
  col = applyAtmos(col, vW);
  gl_FragColor = vec4(col, 1.0);
}
#endif
`;function Ev(i){let e=new $t(1,1,1).toNonIndexed();e.translate(0,.5,0);let t=new $t(1,1,1).toNonIndexed(),n=fr([e,t]),s=e.getAttribute("position").count,r=t.getAttribute("position").count,a=new Float32Array(s+r);a.fill(1,s);let o=new en;o.setAttribute("position",n.getAttribute("position")),o.setAttribute("normal",n.getAttribute("normal")),o.setAttribute("part",new He(a,1));let l=new Float32Array(i.lamps.length*4);i.lamps.forEach((h,p)=>l.set([h.x,h.y,h.z,h.h],p*4)),o.setAttribute("iLamp",new Rt(l,4)),o.instanceCount=i.lamps.length,o.boundingSphere=new St(new D(2e3,-60,500),12e3);let c=new Ge({vertexShader:`#define VERTEX
`+bt+Yu,fragmentShader:`#define FRAGMENT
`+tn+Yu,uniforms:{...ce,...ut}});return new We(o,c)}var Zu=`
#ifdef VERTEX
varying vec3 vW;
varying vec3 vN;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif
#ifdef FRAGMENT
varying vec3 vW;
varying vec3 vN;
void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  SHADOW_OUT(vW)
  vec3 N = normalize(vN);
  vec3 alb = vec3(0.34, 0.33, 0.31) * (0.9 + 0.2 * vnoise2(vW.xz * 0.3 + vW.y));
  if (N.y > 0.9) alb = vec3(0.06, 0.06, 0.065);
  vec3 col = shade(alb, N, vW, 1.0, 0.8, uWet, cloudShadow(vW.xz * 0.001), keyShadow(vW, N));
  col = applyAtmos(col, vW);
  gl_FragColor = vec4(col, 1.0);
}
#endif
`;function Cv(i){let e=i.b[0]-i.a[0],t=i.b[1]-i.a[1],n=Math.hypot(e,t),r=[new $t(i.width,1.2,n+4)];for(let c=1;c<4;c++){let h=new $t(i.width*.7,9,2.2);h.translate(0,-5,-n/2+n*c/4),r.push(h)}for(let c of[-1,1]){let h=new $t(.25,1.1,n+4);h.translate(c*(i.width/2-.15),1.15,0),r.push(h)}let a=fr(r),o=new Ge({vertexShader:`#define VERTEX
`+bt+Zu,fragmentShader:`#define FRAGMENT
`+tn+Zu,uniforms:{...ce,...ut}}),l=new We(a,o);return l.position.set((i.a[0]+i.b[0])/2,i.y+.2,(i.a[1]+i.b[1])/2),l.rotation.y=Math.atan2(e,t),l.updateMatrix(),l.updateMatrixWorld(),l}function fr(i){let e=[],t=[];for(let s of i){let r=s.index?s.toNonIndexed():s;e.push(...r.getAttribute("position").array),t.push(...r.getAttribute("normal").array)}let n=new lt;return n.setAttribute("position",new He(new Float32Array(e),3)),n.setAttribute("normal",new He(new Float32Array(t),3)),n}var $u=`
#ifdef VERTEX
attribute vec2 flow; // \u6CBF\u6CB3\u8DDD\u79BB\u3001\u6A2A\u5411 -1..1
varying vec3 vW;
varying vec2 vFlow;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  vW = position;
  vFlow = flow;
  gl_Position = projectionMatrix * viewMatrix * vec4(position.x, position.y + position.x * position.x * 1.0e-8, position.z, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif
#ifdef FRAGMENT
uniform sampler2D tScene;   // rgb = \u573A\u666F\u989C\u8272\uFF0Ca = \u89C6\u8DDD\uFF08\u7C73\uFF09
uniform mat4 uViewProj;
varying vec3 vW;
varying vec2 vFlow;

// \u6C34\u9762\u6CD5\u7EBF\uFF1A\u98CE\u6D6A + \u987A\u6D41\u7684\u6CE2\u7EB9 + \u96E8\u70B9\u6D9F\u6F2A
vec3 waterNormal(vec3 w, float px) {
  float wind = length(uWind);
  float k = 0.012 + 0.012 * min(wind, 10.0);
  vec2 p = w.xz;
  vec2 drift = uWind * uTimeS * 0.06;
  float t = uTimeS;
  vec2 g = vec2(0.0);
  float fade = 1.0 - smoothstep(0.15, 2.5, px);
  // \u4E24\u5C42\u968F\u98CE\u79FB\u52A8\u7684\u566A\u58F0
  for (int i = 0; i < 3; i++) {
    float s = 0.6 * pow(2.2, float(i));
    vec2 q = (p - drift * (1.0 + float(i) * 0.4)) * s / 6.0;
    float e = 0.07;
    float n0 = vnoise2(q + float(i) * 13.1 + t * 0.05);
    float nx = vnoise2(q + vec2(e, 0.0) + float(i) * 13.1 + t * 0.05);
    float nz = vnoise2(q + vec2(0.0, e) + float(i) * 13.1 + t * 0.05);
    g += vec2(n0 - nx, n0 - nz) / e * (0.5 / pow(1.8, float(i)));
  }
  g *= k * mix(0.35, 1.0, fade);
  // \u987A\u6D41\u7684\u7EC6\u957F\u6CE2\u7EB9
  g.x += sin(vFlow.x * 0.9 - t * 1.4 + vFlow.y * 2.0) * 0.006 * fade;
  // \u96E8\u70B9\u6D9F\u6F2A
  if (uRain > 0.01) {
    vec2 cell = floor(p * 1.6);
    for (int j = 0; j < 4; j++) {
      vec2 c = cell + vec2(float(j % 2), float(j / 2));
      vec2 o = hash22(c) ;
      float ph = fract(t * 0.9 + hash12(c + 3.1));
      vec2 d = p * 1.6 - (c + o);
      float r = length(d);
      float ring = sin((r - ph * 1.2) * 28.0) * exp(-r * 4.0) * (1.0 - ph) * step(hash12(c * 1.3), uRain * 0.9 + 0.1);
      g += normalize(d + 1e-4) * ring * 0.12 * uRain * fade;
    }
  }
  return normalize(vec3(-g.x, 1.0, -g.y));
}

void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  vec3 w = vW;
  vec3 V = normalize(cameraPosition - w);
  float camD = length(cameraPosition - w);
  float px = camD * uPixAng / max(V.y, 0.03);
  vec3 N = waterNormal(w, px);
  vec3 R = reflect(-V, N);
  R.y = abs(R.y);
  float F = 0.02 + 0.98 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  // \u5929\u7A7A\u53CD\u5C04
  vec3 refl = envSpec(R, 0.03 + 0.1 * smoothstep(0.5, 6.0, px));
  // \u5C4F\u5E55\u7A7A\u95F4\u53CD\u5C04\uFF1A\u6CBF\u53CD\u5C04\u65B9\u5411\u627E\u5CB8\u4E0A\u7684\u666F\u7269
  vec4 c0 = uViewProj * vec4(w, 1.0);
  vec2 uv0 = c0.xy / c0.w * 0.5 + 0.5;
  float hitA = 0.0;
  vec3 hitC = vec3(0.0);
  float stepLen = max(camD * 0.025, 1.5);
  vec3 q = w;
  for (int i = 0; i < 20; i++) {
    q += R * stepLen;
    stepLen *= 1.18;
    vec4 c = uViewProj * vec4(q, 1.0);
    if (c.w <= 0.0) break;
    vec2 uv = c.xy / c.w * 0.5 + 0.5;
    if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) break;
    vec4 sc = texture(tScene, uv);
    float qd = length(q - cameraPosition);
    if (sc.a < qd && sc.a > qd - stepLen * 3.0 - 6.0) {
      float edge = smoothstep(0.0, 0.08, min(min(uv.x, uv.y), min(1.0 - uv.x, 1.0 - uv.y)));
      hitC = sc.rgb;
      hitA = edge;
      break;
    }
  }
  refl = mix(refl, hitC, hitA);
  // \u6C34\u4F53\u672C\u8272\uFF1A\u5FAE\u6D51\u7684\u9752\u7EFF\uFF0C\u96E8\u540E\u66F4\u6D51
  vec3 body = mix(vec3(0.012, 0.02, 0.018), vec3(0.03, 0.03, 0.022), uWet);
  vec3 lit = body * (uMirrorE + uAmbSky * 1.5 + uArchE * 1.5) / PI;
  vec3 col = mix(lit, refl, F);
  // \u955C\u5149\u5728\u6C34\u9762\u4E0A\u7684\u9AD8\u5149\uFF08\u5149\u6E90\u5728\u5934\u9876\uFF0C\u53EA\u6709\u4FEF\u89C6\u8FD1\u5904\u624D\u770B\u5F97\u5230\uFF09
  float sp = pow(max(dot(R, uMirrorDir), 0.0), 300.0);
  col += uMirrorE * sp * 40.0 * F;
  // \u96FE\u4E0E\u7A7A\u6C14\u900F\u89C6
  col = applyAtmos(col, w);
  // \u5CB8\u8FB9\u6E10\u9690\uFF08\u4E0E\u5730\u5F62\u76F8\u4EA4\u5904\u67D4\u548C\uFF09
  gl_FragColor = vec4(col, 1.0);
}
#endif
`;function Ju(i){let e=_s,t=[],n=[],s=[],r=12,a=0,o=5;for(let p=0;p<=e.length;p+=r){let{p:u,t:m}=kt(e,p),v=u[0];if(v<-42e3||v>9e4)continue;let g=zt(v)+16,f=i.nearWeight(v,u[1]),d=zi(v)+(1-f)*3.6;for(let x=0;x<=o;x++){let M=x/o*2-1;t.push(v-m[1]*g*M,d,u[1]+m[0]*g*M),n.push(p,M)}if(a>0){let x=(a-1)*(o+1),M=a*(o+1);for(let b=0;b<o;b++)s.push(x+b,x+b+1,M+b,x+b+1,M+b+1,M+b)}a++}let l=new lt;l.setAttribute("position",new He(new Float32Array(t),3)),l.setAttribute("flow",new He(new Float32Array(n),2)),l.setIndex(s),l.boundingSphere=new St(new D(2e4,-70,4e3),9e4);let c=new Ge({vertexShader:`#define VERTEX
`+bt+$u,fragmentShader:`#define FRAGMENT
`+tn+$u,uniforms:{...ce,...ut,tScene:{value:null},uViewProj:{value:null}}});return{mesh:new We(l,c),mat:c}}var qe={ROUND:0,DECID:1,PINE:2,POPLAR:3,WILLOW:4,GINKGO:5,BAMBOO:6,BLOSSOM:7};function Rv(i,e,t,n,s,r){let a=Ou(i/700+3.7,e/700+1.9,3)*.75+Vi(i/160,e/160)*.25,o=_c(16,60,s),l=a+o*.3+Math.min(t,.6)*.55-.5;return l-=r*1.3,l-=(1-_c(70,160,n))*.6,_c(0,.1,l)}function _c(i,e,t){let n=Math.max(0,Math.min(1,(t-i)/(e-i)));return n*n*(3-2*n)}function Qu(i,e,t){let n=No(777),s=[],r=(g,f,d,x,M,b=.6)=>{s.push({x:g,z:f,y:i.height(g,f)-b,h:d,r:x,type:M,seed:n()})},a=1024,o=ft.size/a,l=new Uint8Array(a*a);for(let g of e.buildings){let f=Math.cos(g.rot),d=Math.sin(g.rot);for(let x=-g.w/2-2;x<=g.w/2+2;x+=o*.8)for(let M=-g.d/2-2;M<=g.d/2+2;M+=o*.8){let b=g.x+f*x-d*M,A=g.z+d*x+f*M,w=Math.floor((b-ft.x0)/o),C=Math.floor((A-ft.z0)/o);w>=0&&C>=0&&w<a&&C<a&&(l[C*a+w]=1)}}let c=(g,f)=>{let d=Math.floor((g-ft.x0)/o),x=Math.floor((f-ft.z0)/o);return d<0||x<0||d>=a||x>=a?!1:l[x*a+d]===1},h=(g,f,d)=>{for(let x of e.roads)if(x.cls!=="path")for(let M=0;M<x.pts.length-1;M++){let[b,A]=x.pts[M],[w,C]=x.pts[M+1],_=w-b,S=C-A,U=_*_+S*S||1,R=Math.max(0,Math.min(1,((g-b)*_+(f-A)*S)/U)),F=b+_*R-g,O=A+S*R-f;if(F*F+O*O<(x.width/2+d)**2)return!0}return!1},p=t>=2?1:t===1?.65:.4,u=[[0,1600,8.5],[1600,4200,15],[4200,9e3,30]];for(let[g,f,d]of u){let x=d/Math.sqrt(p);for(let M=-f;M<=f;M+=x)for(let b=-f;b<=f;b+=x){let A=b+(n()-.5)*x,w=M+(n()-.5)*x,C=Math.hypot(A,w);if(C<g||C>=f)continue;let _=i.riverDist(A,w),S=zi(A),R=i.height(A,w)-S,F=i.slope(A,w),O=jn(A,w),G=Rv(A,w,F,_,R,O);if(G<=.05||n()>G||C<260&&A>-20&&Math.abs(w)<120+A*.4||c(A,w))continue;let V=Vi(A/90+7,w/90)>.55?n()<.6?qe.PINE:qe.ROUND:n()<.1?qe.GINKGO:qe.DECID,W=C<1600?1:C<4200?1.35:1.9,re=(V===qe.PINE?13+n()*9:10+n()*8)*(.9+.2*n());r(A,w,re*Math.min(W,1.3),(V===qe.PINE?2.6:3.6+n()*1.8)*W,V)}}let m=[[-6,-15,9,qe.ROUND],[5,17,8,qe.DECID],[-16,9,11,qe.PINE],[-14,-24,12,qe.PINE],[14,-26,7,qe.BLOSSOM],[22,30,9,qe.DECID],[-30,-6,13,qe.PINE],[-26,22,10,qe.ROUND],[34,-42,9,qe.DECID],[40,52,10,qe.ROUND],[-44,30,12,qe.PINE],[-40,-40,12,qe.ROUND]];for(let[g,f,d,x]of m)r(g,f,d,x===qe.PINE?2.4:3.4,x,.3);for(let g=0;g<260;g++){let f=n()*Math.PI*2,d=30+Math.sqrt(n())*280,x=Math.cos(f)*d-40,M=Math.sin(f)*d,b=Math.atan2(M,x);if(b>-.75&&b<.9&&d<260||x>120&&M>-200&&M<200||i.height(x,M)<-55)continue;let w=n()<.4?qe.PINE:n()<.7?qe.ROUND:qe.DECID;r(x,M,9+n()*8,w===qe.PINE?2.6:3.4+n()*1.4,w,.4)}let v=[[[175,-175],[520,-175],9],[[175,168],[520,168],9],[[518,-170],[518,160],9],[[300,-100],[300,-60],6],[[340,100],[455,100],8],[[340,4],[455,4],8]];for(let[g,f,d]of v){let x=Math.hypot(f[0]-g[0],f[1]-g[1]);for(let M=0;M<=x;M+=d){let b=g[0]+(f[0]-g[0])*M/x,A=g[1]+(f[1]-g[1])*M/x;if(c(b,A))continue;let w=n()<.25?qe.GINKGO:qe.ROUND;r(b,A,8+n()*4,2.6+n(),w,.2)}}for(let g of e.roads){if(g.cls==="path"||g.cls==="lane")continue;let f=Gi(g.pts),d=g.cls==="country"?14:10,x=g.cls==="country"?qe.POPLAR:n()<.5?qe.ROUND:qe.GINKGO;for(let M=5;M<f.length;M+=d){let{p:b,t:A}=kt(f,M),w=jn(b[0],b[1]);if(!(g.cls!=="country"&&w<.05)&&!(g.cls==="country"&&n()<.35))for(let C of[-1,1]){let _=g.width/2+2.2,S=b[0]-A[1]*_*C,U=b[1]+A[0]*_*C;if(c(S,U)||i.riverDist(S,U)<zt(S)+3||i.railDist(S,U)<8)continue;let R=x===qe.POPLAR?16+n()*6:8+n()*4;r(S,U,R,x===qe.POPLAR?1.8:2.6+n()*.8,x,.2)}}}for(let g=0;g<1400*p;g++){let f=300+n()*3200,d=-600+n()*2e3,x=jn(f,d);if(n()>x*.8+.05||c(f,d)||h(f,d,2)||i.riverDist(f,d)<zt(f)+6||i.railDist(f,d)<10||f>160&&f<530&&d>-190&&d<180)continue;let M=n(),b=M<.35?qe.ROUND:M<.6?qe.DECID:M<.72?qe.BAMBOO:M<.85?qe.BLOSSOM:qe.GINKGO;r(f,d,b===qe.BAMBOO?7+n()*4:6+n()*6,b===qe.BAMBOO?2.5:2.4+n()*1.6,b,.3)}for(let f=-3e3;f<15e3;f+=11)for(let d of[-1,1]){if(n()<(jn(f,0)>.1?.25:.55))continue;let x=Pv(f,i),b=zt(f)+5+n()*8,A=x+d*b;if(c(f,A)||h(f,A,1.5)||i.railDist(f,A)<9)continue;let w=n()<.7;r(f,A,w?8+n()*3:15+n()*5,w?3.6:1.8,w?qe.WILLOW:qe.POPLAR,.3)}for(let g=0;g<2600*p;g++){let f=-2e3+n()*18e3,d=-2500+n()*6500,x=Math.hypot(f,d);if(x<400)continue;let M=zi(f);if(i.height(f,d)-M>20||i.riverDist(f,d)<zt(f)+20||jn(f,d)>.15||i.railDist(f,d)<12||Math.abs(Vi(f/260,d/90)-.5)>.025&&n()>.04)continue;let C=n(),_=C<.45?qe.POPLAR:C<.7?qe.DECID:C<.85?qe.BAMBOO:qe.ROUND,S=x<2e3?1:1.25;r(f,d,(_===qe.POPLAR?15+n()*5:8+n()*5)*S,(_===qe.POPLAR?1.8:3)*S,_,.3)}return s}var ju=new Map;function Pv(i,e){let t=Math.round(i/10),n=ju.get(t);if(n!==void 0)return n;let s=1/0,r=0;for(let a=-1e3;a<=4500;a+=20){let o=e.riverDist(i,a);o<s&&(s=o,r=a)}for(let a=r-20;a<=r+20;a+=2){let o=e.riverDist(i,a);o<s&&(s=o,r=a)}return ju.set(t,r),r}var ef=`
#ifdef VERTEX
attribute vec4 iPos;    // x, y, z, h
attribute vec4 iParam;  // r, type, seed, -
attribute float part;   // 0 \u6811\u5E72, 1.. \u6811\u51A0\u56E2
attribute vec3 blobC;   // \u6811\u51A0\u56E2\u4E2D\u5FC3\uFF08\u5355\u4F4D\u7A7A\u95F4\uFF09
varying vec3 vW;
varying vec3 vN;
varying vec3 vObj;
varying float vPart;
varying vec4 vParam;
varying float vAO;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  float h = iPos.w;
  float r = iParam.x;
  float type = iParam.y;
  float seed = iParam.z;
  vec3 p = position;
  vec3 n = normal;
  vec3 lp;
  if (part < 0.5) {
    // \u6811\u5E72\uFF1A\u5355\u4F4D\u5706\u67F1 y\u2208[0,1]
    float trunkH = type > 5.5 && type < 6.5 ? 0.0 : (type > 1.5 && type < 2.5 ? 0.55 : 0.42);
    float tr = max(0.12, h * 0.018) * (type > 2.5 && type < 3.5 ? 0.8 : 1.0);
    lp = vec3(p.x * tr, p.y * h * trunkH, p.z * tr);
    vAO = 0.6;
  } else {
    // \u6811\u51A0\uFF1A\u6309\u6811\u79CD\u5851\u5F62
    vec3 c = blobC;
    vec3 q = p; // \u5355\u4F4D\u7403\u4E0A\u7684\u70B9\uFF08\u534A\u5F84 1\uFF09
    float rr = r;
    float cy;
    vec3 sc;
    if (type > 1.5 && type < 2.5) {
      // \u9488\u53F6\uFF1A\u9525\u5F62
      float yy = c.y + q.y * 0.5;
      float cone = mix(1.0, 0.15, sat(yy));
      sc = vec3(rr * cone, h * 0.62, rr * cone);
      cy = h * 0.32;
      lp = vec3((c.x + q.x * 0.55) * sc.x, cy + yy * sc.y, (c.z + q.z * 0.55) * sc.z);
    } else if (type > 2.5 && type < 3.5) {
      // \u6768\u6811\uFF1A\u7A84\u9AD8
      sc = vec3(rr, h * 0.33, rr);
      cy = h * 0.6;
      lp = vec3((c.x * 0.6 + q.x * 0.7) * sc.x, cy + (c.y * 0.8 + q.y * 0.6) * sc.y, (c.z * 0.6 + q.z * 0.7) * sc.z);
    } else if (type > 3.5 && type < 4.5) {
      // \u5782\u67F3\uFF1A\u4E0B\u5782\u3001\u5E95\u90E8\u66F4\u5BBD
      float droop = sat(-q.y * 0.5 + 0.5);
      sc = vec3(rr * (0.8 + 0.5 * droop), h * 0.4, rr * (0.8 + 0.5 * droop));
      cy = h * 0.58;
      lp = vec3((c.x + q.x * 0.6) * sc.x, cy + (c.y * 0.6 + q.y * 0.75) * sc.y, (c.z + q.z * 0.6) * sc.z);
    } else if (type > 5.5 && type < 6.5) {
      // \u7AF9\u4E1B\uFF1A\u7EC6\u9AD8\u7684\u7FBD\u72B6\u56E2
      sc = vec3(rr * 0.9, h * 0.5, rr * 0.9);
      cy = h * 0.5;
      lp = vec3((c.x * 0.7 + q.x * 0.5) * sc.x, cy + (c.y + q.y * 0.6) * sc.y, (c.z * 0.7 + q.z * 0.5) * sc.z);
    } else {
      sc = vec3(rr, h * 0.3, rr);
      cy = h * 0.66;
      lp = vec3((c.x + q.x * 0.62) * sc.x, cy + (c.y + q.y * 0.62) * sc.y, (c.z + q.z * 0.62) * sc.z);
    }
    // \u4E0D\u89C4\u5219\uFF1A\u6CBF\u6CD5\u7EBF\u7684\u566A\u58F0\u8D77\u4F0F
    float bump = vnoise3(q * 2.3 + seed * 17.0 + c * 3.0) - 0.5;
    lp += n * bump * rr * 0.28;
    n = normalize(n / max(sc, vec3(0.1)) * vec3(rr));
    vAO = sat(0.45 + 0.55 * (q.y * 0.5 + 0.5) + 0.25 * length(c.xz));
  }
  // \u968F\u673A\u671D\u5411
  float a = seed * 6.2832;
  float ca = cos(a), sa = sin(a);
  lp = vec3(ca * lp.x - sa * lp.z, lp.y, sa * lp.x + ca * lp.z);
  n = vec3(ca * n.x - sa * n.z, n.y, sa * n.x + ca * n.z);
  // \u98CE\u6446
  float hf = lp.y / max(h, 1.0);
  float wind = length(uWind);
  vec2 wd = wind > 0.01 ? uWind / wind : vec2(1.0, 0.0);
  float sway = (0.02 + 0.012 * wind) * hf * hf * h;
  float ph = uTimeS * (1.3 + seed) + iPos.x * 0.05 + iPos.z * 0.04;
  float gust = 0.6 + 0.4 * sin(uTimeS * 0.21 + iPos.x * 0.003);
  lp.xz += wd * sway * (0.5 + 0.5 * sin(ph)) * gust;
  vec3 wp = lp + iPos.xyz;
  vW = wp;
  vN = n;
  vObj = (part < 0.5 ? p * 3.0 : p + blobC * 2.0) + seed * 31.0;
  vPart = part;
  vParam = iParam;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif

#ifdef FRAGMENT
uniform vec4 uSeasonA;
uniform vec4 uSeasonB;
uniform vec4 uSeasonC;
uniform vec4 uSeasonD;
varying vec3 vW;
varying vec3 vN;
varying vec3 vObj;
varying float vPart;
varying vec4 vParam;
varying float vAO;

vec3 leafColor(float type, float seed, float n) {
  float leaf = uSeasonA.x;      // 0.12..1
  float aut = uSeasonA.y;
  float fresh = uSeasonA.w;
  vec3 summer = mix(vec3(0.035, 0.07, 0.025), vec3(0.06, 0.11, 0.035), n);
  summer = mix(summer, vec3(0.08, 0.15, 0.04), fresh * 0.6);
  if (type < 0.5) return mix(vec3(0.03, 0.06, 0.025), vec3(0.05, 0.085, 0.03), n); // \u5E38\u7EFF\u9614\u53F6
  if (type > 1.5 && type < 2.5) return mix(vec3(0.02, 0.04, 0.025), vec3(0.035, 0.06, 0.035), n); // \u9488\u53F6
  if (type > 5.5 && type < 6.5) return mix(vec3(0.06, 0.1, 0.03), vec3(0.09, 0.13, 0.04), n) * mix(1.0, 0.85, uSeasonA.z); // \u7AF9
  vec3 autumnC = type > 4.5 && type < 5.5 ? vec3(0.42, 0.3, 0.03) : mix(vec3(0.26, 0.08, 0.02), vec3(0.3, 0.2, 0.04), seed);
  if (type > 3.5 && type < 4.5) autumnC = vec3(0.2, 0.19, 0.05);
  vec3 c = mix(summer, autumnC, aut);
  if (type > 6.5) c = mix(c, mix(vec3(0.75, 0.62, 0.66), vec3(0.8, 0.8, 0.78), seed), uSeasonD.z);
  return c;
}

void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  float type = vParam.y;
  float seed = vParam.z;
  vec3 V = normalize(cameraPosition - vW);
  float camD = length(cameraPosition - vW);
  float px = camD * uPixAng;
  vec3 alb;
  float alpha = 1.0;
  float ao = vAO;
  if (vPart < 0.5) {
    alb = vec3(0.07, 0.055, 0.045) * (0.8 + 0.4 * vnoise3(vObj * 4.0));
    if (type > 5.5 && type < 6.5) alb = vec3(0.12, 0.13, 0.06);
  } else {
    // \u53F6\u7C07\uFF1A\u660E\u6697\u5757\u4E0E\u53C2\u5DEE\u7684\u8FB9\u7F18
    float detailK = 1.0 - smoothstep(0.08, 0.6, px);
    float f1 = vnoise3(vObj * 4.2);
    float f2 = vnoise3(vObj * 12.0 + 3.0);
    float f3 = vnoise3(vObj * 30.0 + 7.0);
    float clump = f1 * 0.6 + mix(0.5, f2, max(detailK, 0.3)) * 0.28 + mix(0.5, f3, detailK) * 0.12;
    alb = leafColor(type, seed, clump);
    // \u843D\u53F6\u6811\u7684\u53F6\u91CF\uFF08\u51AC\u5B63\u7A00\u758F\uFF0C\u9732\u51FA\u679D\u6761\u7684\u7070\u8910\u8272\uFF09
    float deciduous = (type > 0.5 && type < 1.5) || (type > 3.5 && type < 5.5) || type > 6.5 ? 1.0 : 0.0;
    float leaf = mix(1.0, uSeasonA.x, deciduous);
    vec3 twig = vec3(0.07, 0.06, 0.05);
    float sparse = smoothstep(0.55, 0.15, leaf);
    alb = mix(alb, twig, sparse * 0.85);
    // \u8FB9\u7F18\u9542\u7A7A\uFF1A\u8D8A\u9760\u8F6E\u5ED3\u8D8A\u5BB9\u6613\u900F
    float rim = 1.0 - abs(dot(N, V));
    float thr = mix(0.3, 0.66, rim) + sparse * 0.35;
    float farFade = smoothstep(0.4, 2.5, px);
    thr = mix(thr, thr * 0.4, farFade);
    alpha = smoothstep(thr - 0.08, thr + 0.08, clump + (1.0 - leaf) * -0.25 * deciduous);
    ao *= 0.6 + 0.4 * clump;
    // \u900F\u8FC7\u53F6\u9699\u770B\u5230\u7684\u662F\u6811\u51A0\u5185\u4FA7\uFF1A\u66F4\u6697
    if (!gl_FrontFacing) ao *= 0.45;
    // \u53F6\u7247\u6CD5\u7EBF\u8D77\u4F0F
    N = normalize(N + (vec3(f2, f1, f2) - 0.5) * 0.7 * (1.0 - farFade));
  }
  if (alpha < 0.02) discard;
#ifdef SHADOW_PASS
  if (alpha < 0.5) discard;
#endif
  SHADOW_OUT(vW)
  float cs = cloudShadow(vW.xz * 0.001);
  float ks = keyShadow(vW, N);
  vec3 col = shade(alb, N, vW, ao, 0.9, uWet * 0.6, cs, ks);
  // \u900F\u5149\uFF1A\u5149\u4ECE\u5934\u9876\u7A7F\u8FC7\u53F6\u5C42\uFF0C\u51A0\u5E95\u6CDB\u51FA\u9EC4\u7EFF
  if (vPart > 0.5) {
    float back = sat(-dot(N, uMirrorDir)) * 0.5 + 0.15;
    col += alb * vec3(0.9, 1.15, 0.6) * uMirrorE * back * cs * 0.28;
  }
  col = applyAtmos(col, vW);
  gl_FragColor = vec4(col, alpha);
}
#endif
`;function yc(i,e){let t=[],n=[],s=[],r=[],a=new Vs(1,1.3,1,i>1?6:4,1,!0).toNonIndexed();a.translate(0,.5,0);let o=a.getAttribute("position").array,l=a.getAttribute("normal").array;for(let m=0;m<o.length;m+=3)t.push(o[m],o[m+1],o[m+2]),n.push(l[m],l[m+1],l[m+2]),s.push(0),r.push(0,0,0);let c=i===1?[[0,0,0]]:[[0,.15,0],[.42,-.12,.1],[-.35,-.08,.32],[-.1,-.15,-.45],[.2,.42,-.15]].slice(0,i),p=new Hs(1,e).toNonIndexed().getAttribute("position").array;c.forEach((m,v)=>{for(let g=0;g<p.length;g+=3){let f=p[g],d=p[g+1],x=p[g+2],M=Math.hypot(f,d,x);t.push(f/M,d/M,x/M),n.push(f/M,d/M,x/M),s.push(v+1),r.push(m[0],m[1],m[2])}});let u=new lt;return u.setAttribute("position",new He(new Float32Array(t),3)),u.setAttribute("normal",new He(new Float32Array(n),3)),u.setAttribute("part",new He(new Float32Array(s),1)),u.setAttribute("blobC",new He(new Float32Array(r),3)),u}function Mc(i,e){let t=new en;for(let r of["position","normal","part","blobC"])t.setAttribute(r,i.getAttribute(r));let n=new Float32Array(e.length*4),s=new Float32Array(e.length*4);return e.forEach((r,a)=>{n.set([r.x,r.y,r.z,r.h],a*4),s.set([r.r,r.type,r.seed,0],a*4)}),t.setAttribute("iPos",new Rt(n,4)),t.setAttribute("iParam",new Rt(s,4)),t.instanceCount=e.length,t.boundingSphere=new St(new D(0,0,0),2e4),t}function Iv(){return new Ge({vertexShader:`#define VERTEX
`+bt+`
uniform float uTimeS;
uniform vec2 uWind;
`+ef,fragmentShader:`#define FRAGMENT
`+tn+ef,uniforms:{...ce,...ut},side:2,alphaToCoverage:!0})}function tf(i){let e=[],t=[],n=[];for(let a of i){let o=Math.hypot(a.x,a.z);o<420?e.push(a):o<2200?t.push(a):n.push(a)}let s=Iv(),r=[];return e.length&&r.push(new We(Mc(yc(5,2),e),s)),t.length&&r.push(new We(Mc(yc(3,1),t),s)),n.length&&r.push(new We(Mc(yc(1,1),n),s)),r}var nf=`
#ifdef VERTEX
attribute vec2 uvw;
varying vec3 vW;
varying vec3 vN;
varying vec2 vUvw;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vUvw = uvw;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif
#ifdef FRAGMENT
uniform float uKind; // 0 \u8F68\u9053\u5E26, 1 \u6DF7\u51DD\u571F\u7ED3\u6784, 2 \u91D1\u5C5E\u7ACB\u67F1
varying vec3 vW;
varying vec3 vN;
varying vec2 vUvw;
void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  SHADOW_OUT(vW)
  vec3 N = normalize(vN);
  float camD = length(cameraPosition - vW);
  float px = camD * uPixAng;
  vec3 alb;
  float rough = 0.9;
  float wet = uWet * 0.6;
  if (uKind < 0.5) {
    // \u8F68\u9053\uFF1Au = \u6CBF\u7EBF\u8DDD\u79BB\uFF0Cv = \u6A2A\u5411\uFF08\u7C73\uFF09
    float u = vUvw.x;
    float v = vUvw.y;
    vec3 ballast = vec3(0.17, 0.16, 0.15) * (0.85 + 0.3 * vnoise2(vec2(u, v) * 3.0));
    float sl = smoothstep(0.62, 0.5, abs(fract(u / 0.6) - 0.5)) * step(abs(v), 1.3);
    float fade = 1.0 - smoothstep(0.08, 0.5, px);
    vec3 sleeper = vec3(0.25, 0.24, 0.23);
    alb = mix(ballast, sleeper, sl * fade + 0.35 * (1.0 - fade) * step(abs(v), 1.3));
    float rails = (1.0 - smoothstep(0.035, 0.035 + px, abs(abs(v) - 0.7175)));
    alb = mix(alb, vec3(0.32, 0.31, 0.3), rails * max(fade, 0.3));
    rough = mix(rough, 0.25, rails);
  } else if (uKind < 1.5) {
    alb = vec3(0.36, 0.35, 0.33) * (0.9 + 0.2 * vnoise2(vW.xz * 0.2 + vW.y * 0.5));
  } else {
    alb = vec3(0.24, 0.25, 0.27);
    rough = 0.5;
  }
  vec3 col = shade(alb, N, vW, 1.0, rough, wet, cloudShadow(vW.xz * 0.001), keyShadow(vW, N));
  col = applyAtmos(col, vW);
  gl_FragColor = vec4(col, 1.0);
}
#endif
`;function bc(i){return new Ge({vertexShader:`#define VERTEX
`+bt+nf,fragmentShader:`#define FRAGMENT
`+tn+nf,uniforms:{...ce,...ut,uKind:{value:i}}})}function dr(i,e,t){let n=zi(e)+5.6+.35,s=i.nearWeight(e,t),r=i.height(e,t)+.3;return s>.5?n:Math.max(r,n*s+r*(1-s))}function af(i){let e=ys,t=[],n=[],s=[],r=[],a=[],o=0,l=1.7,c=0;for(let d=c;d<=e.length;d+=6){let{p:x,t:M}=kt(e,d);if(x[0]<-14e3||x[0]>26e3)continue;let b=dr(i,x[0],x[1]);for(let A of[-1,1])n.push(x[0]-M[1]*l*A,b,x[1]+M[0]*l*A),s.push(0,1,0),r.push(d,l*A);if(o>0){let A=(o-1)*2,w=o*2;a.push(A,A+1,w,A+1,w+1,w)}o++}let h=new lt;h.setAttribute("position",new He(new Float32Array(n),3)),h.setAttribute("normal",new He(new Float32Array(s),3)),h.setAttribute("uvw",new He(new Float32Array(r),2)),h.setIndex(a),h.boundingSphere=new St(new D(6e3,-60,1500),24e3),t.push(new We(h,bc(0)));let p=[],u=[],m=(d,x,M,b,A,w,C,_)=>{let S=new $t(x,M,b).toNonIndexed();S.rotateY(_),S.translate(A,w,C),d.push(S)};for(let d=20;d<e.length;d+=55){let{p:x,t:M}=kt(e,d);if(x[0]<-6e3||x[0]>21e3)continue;let b=dr(i,x[0],x[1]),A=-Math.atan2(M[1],M[0]),w=-M[1]*3.1,C=M[0]*3.1;m(u,.3,7.2,.3,x[0]+w,b+3.6,x[1]+C,A),m(u,.12,.12,3.6,x[0]+w*.45,b+6.6,x[1]+C*.45,A)}{let d=Bo(e,Bt.x);for(let x=d-Bt.len/2;x<d+Bt.len/2;x+=10){let{p:M,t:b}=kt(e,x),A=dr(i,M[0],M[1]),w=-Math.atan2(b[1],b[0]);m(p,10.2,1,5.2,M[0]-b[1]*4.6,A-.1,M[1]+b[0]*4.6,w),Math.abs(x-d)<55&&(m(u,10.2,.18,5.6,M[0]-b[1]*4.8,A+4.2,M[1]+b[0]*4.8,w),m(u,.25,3.8,.25,M[0]-b[1]*5.6,A+2.2,M[1]+b[0]*5.6,w))}}for(let d=0;d<e.length;d+=4){let{p:x,t:M}=kt(e,d);if(x[0]<-6e3||x[0]>26e3)continue;let b=i.riverDist(x[0],x[1]),A=zt(x[0]);if(b<A+14){let w=dr(i,x[0],x[1]),C=-Math.atan2(M[1],M[0]);m(p,4.4,1.6,6,x[0],w-1,x[1],C+Math.PI/2),Math.round(d)%24===0&&m(p,3,9,2,x[0],w-5.5,x[1],C+Math.PI/2);for(let _ of[-1,1])m(u,6.2,.35,.3,x[0]-M[1]*2.2*_,w+1.6,x[1]+M[0]*2.2*_,C)}}let v=new We(sf(fr(p)),bc(1));v.geometry.boundingSphere=new St(new D(6e3,-60,1500),24e3),t.push(v);let g=new We(sf(fr(u)),bc(2));g.geometry.boundingSphere=new St(new D(6e3,-60,1500),24e3),t.push(g);let f=new Sc(i,e);return t.push(f.mesh),{meshes:t,train:f}}function sf(i){let e=i.getAttribute("position").count;return i.setAttribute("uvw",new He(new Float32Array(e*2),2)),i}function Bo(i,e){let t=0,n=i.length;for(let s=0;s<40;s++){let r=(t+n)/2;kt(i,r).p[0]<e?t=r:n=r}return(t+n)/2}var rf=`
#ifdef VERTEX
attribute vec4 iCar;  // x, y, z, heading
attribute vec4 iCar2; // \u8F66\u53A2\u5E8F\u53F7, \u662F\u5426\u8F66\u5934(\xB11), \u53EF\u89C1, -
varying vec3 vW;
varying vec3 vN;
varying vec3 vL;
varying vec4 vCar2;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  vec3 p = position; // \u5355\u4F4D\u76D2\uFF0Cx \u6CBF\u8F66\u8EAB
  vec3 lp = vec3(p.x * 25.0, p.y * 3.7 + 1.85 + 0.35, p.z * 3.2);
  // \u8F66\u5934\u6D41\u7EBF
  float nose = iCar2.y;
  if (nose != 0.0 && p.x * nose > 0.45) lp.y -= (p.y > 0.3 ? 1.1 : 0.0);
  float c = cos(iCar.w), s = sin(iCar.w);
  vec3 wp = vec3(c * lp.x - s * lp.z, lp.y, s * lp.x + c * lp.z) + iCar.xyz;
  if (iCar2.z < 0.5) wp = vec3(0.0, -1.0e5, 0.0);
  vW = wp;
  vN = vec3(c * normal.x - s * normal.z, normal.y, s * normal.x + c * normal.z);
  vL = vec3(p.x * 25.0, lp.y, p.z);
  vCar2 = iCar2;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif
#ifdef FRAGMENT
varying vec3 vW;
varying vec3 vN;
varying vec3 vL;
varying vec4 vCar2;
void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  SHADOW_OUT(vW)
  vec3 N = normalize(vN);
  vec3 alb = vec3(0.72, 0.73, 0.74);
  // \u8170\u7EBF\u4E0E\u7A97\u5E26
  float y = vL.y;
  float stripe = step(1.25, y) * step(y, 1.55);
  alb = mix(alb, vec3(0.12, 0.3, 0.42), stripe);
  float win = step(2.0, y) * step(y, 3.1) * step(0.12, fract(vL.x / 2.6)) * step(abs(N.y), 0.5);
  alb = mix(alb, vec3(0.03, 0.035, 0.04), win);
  vec3 col = shade(alb, N, vW, 1.0, mix(0.4, 0.1, win), max(uWet, win), cloudShadow(vW.xz * 0.001), keyShadow(vW, N));
  float night = smoothstep(0.2, 0.6, uNight);
  col += vec3(1.0, 0.92, 0.8) * win * 0.004 * night;
  // \u8F66\u5934\u706F
  if (vCar2.y != 0.0 && vL.x * vCar2.y > 12.0 && y < 1.9 && y > 0.9) col += vec3(1.0, 0.95, 0.85) * 0.3 * (0.3 + night);
  col = applyAtmos(col, vW);
  gl_FragColor = vec4(col, 1.0);
}
#endif
`,Sc=class{constructor(e,t){this.terrain=e;this.pl=t;this.cars=4;this.nTrains=2;this.nearTown=!1;let n=new $t(1,1,1).toNonIndexed(),s=new en;s.setAttribute("position",n.getAttribute("position")),s.setAttribute("normal",n.getAttribute("normal"));let r=this.cars*this.nTrains;this.a1=new Rt(new Float32Array(r*4),4),this.a2=new Rt(new Float32Array(r*4),4),s.setAttribute("iCar",this.a1),s.setAttribute("iCar2",this.a2),s.instanceCount=r,s.boundingSphere=new St(new D(6e3,-60,1500),3e4);let a=new Ge({vertexShader:`#define VERTEX
`+bt+rf,fragmentShader:`#define FRAGMENT
`+tn+rf,uniforms:{...ce,...ut}});this.mesh=new We(s,a),this.mesh.frustumCulled=!1}update(e){let t=.027777777777777776,n=this.pl.length,s=Bo(this.pl,Bt.x),r=Bo(this.pl,-14e3),a=Bo(this.pl,26e3),o=33,l=50;this.nearTown=!1;for(let c=0;c<this.nTrains;c++){let h=c===0,u=((e+(h?0:t/2))%t+t)%t*86400,m=Math.abs(s-(h?r:a)),v=m/o,g;u<v?g=u*o:u<v+l?g=m:g=m+(u-v-l)*o;let f=600;if(u<v&&m-g<f){let M=m-g;g=m-f*Math.pow(M/f,2)*.5-M*.5}let d=h?r+g:a-g,x=d>r-200&&d<a+200&&d>0&&d<n;for(let M=0;M<this.cars;M++){let b=h?d-M*26-13:d+M*26+13,{p:A,t:w}=kt(this.pl,Math.max(0,Math.min(n,b))),C=dr(this.terrain,A[0],A[1]),_=Math.atan2(w[1],w[0]),S=c*this.cars+M;this.a1.setXYZW(S,A[0],C,A[1],_);let U=M===0?h?1:-1:M===this.cars-1?h?-1:1:0;this.a2.setXYZW(S,M,U,x?1:0,0),x&&Math.abs(A[0]-1500)<4e3&&(this.nearTown=!0)}}this.a1.needsUpdate=!0,this.a2.needsUpdate=!0}};function Wi(i,e,t){let n=Math.floor(i),s=Math.floor(e),r=Math.floor(t),a=u=>u*u*(3-2*u),o=a(i-n),l=a(e-s),c=a(t-r),h=(u,m,v)=>dn(n+u,s+m,r+v),p=(u,m,v)=>u+(m-u)*v;return p(p(p(h(0,0,0),h(1,0,0),o),p(h(0,1,0),h(1,1,0),o),l),p(p(h(0,0,1),h(1,0,1),o),p(h(0,1,1),h(1,1,1),o),l),c)}function bs(i,e,t){let n=Math.max(0,Math.min(1,(t-i)/(e-i)));return n*n*(3-2*n)}function Dv(i,e,t){let n=Math.abs(t),s=Math.cos(e)*i,r=Math.sin(e)*i,a=Wi(s/1800,r/1800,t/1800)-.5,o=3e3+500*a,l=7e3-700*(Wi(s/2300+7,r/2300+7,t/2300+7)-.3),c=3750-900*Wi(s/2600+3,r/2600+3,t/2600+3),h=bs(o,o+600,i)*(1-bs(l-900,l,i))*(1-bs(c-700,c,n))*bs(260,510,n);if(h<=0)return 0;let p=Math.pow(Math.abs(Math.sin((i+300*a)/1e3*Math.PI)),6),u=bs(.42,.72,Wi(s/1500,r/1500,t/1500)*.65+Wi(s/640,r/640,t/640)*.35),m=Wi(s/260,r/260,t/260),v=Wi(s/90,r/90,t/90),g=bs(.3,.9,m*.65+v*.35);return h*u*(.3+.7*p)*(.1+.9*g*g)}var Lv=`
attribute vec4 mod4; // rho, psi, z, seed
uniform float uSpin;
uniform float uTimeS;
uniform float uMirrorDay;
uniform float uPixAng;
uniform vec3 uDayE;
varying vec3 vCol;
void main() {
  float rho = mod4.x, psi = mod4.y, z = mod4.z, seed = mod4.w;
  float a = psi - uSpin;
  vec3 P = vec3(rho * sin(a), 50000.0 - rho * cos(a), z);
  vec3 dir = normalize(P);
  gl_Position = projectionMatrix * viewMatrix * vec4(cameraPosition + dir * 100.0, 1.0);
  // \u662F\u5426\u6B63\u628A\u5149\u53CD\u5C04\u7ED9\u6211\u4EEC\uFF1A\u6309\u65F6\u9699\u968F\u673A\u5207\u6362\uFF0C\u767D\u663C\u6BD4\u4F8B\u9AD8
  float slot = floor(uTimeS / 180.0 + seed * 17.0);
  float r = hash12(vec2(slot, seed * 1000.0));
  float frac = 0.015 + 0.42 * uMirrorDay;
  float t = fract(uTimeS / 180.0 + seed * 17.0);
  float env = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.92, t);
  float act = step(r, frac) * env;
  // \u591C\u91CC\u5076\u5C14\u7684\u955C\u95EA
  float flash = step(0.9993, hash12(vec2(floor(uTimeS / 9.0), seed * 733.0))) * (1.0 - uMirrorDay);
  float glint = act * (0.6 + 0.8 * hash12(vec2(seed, 3.0))) * mix(0.25, 1.0, uMirrorDay) + flash * 3.0;
  // \u60EF\u6027\u7CFB\u4E2D\u88AB\u6052\u661F\u7167\u4EAE\u7684\u6A21\u5757\u80CC\u9762\uFF08\u6781\u6DE1\uFF09
  float passive = 0.08 + 0.05 * hash12(vec2(seed, 9.0));
  vCol = uDayE * glint * 12.0 + vec3(0.8, 0.84, 0.92) * passive * 0.0015;
  gl_PointSize = 1.0 + glint * 1.6;
}
`,Fv=`
varying vec3 vCol;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float r2 = dot(q, q) * 4.0;
  float a = exp(-r2 * 3.0);
  gl_FragColor = vec4(vCol * a, 1.0);
}
`;function wc(i){let{rMin:e,rMax:t,zMax:n}=At.mirror,s=new Float32Array(i*4),r=0,a=12345,o=()=>(a=a*1664525+1013904223>>>0,a/4294967296),l=0;for(;r<i&&l<i*60;){l++;let u=Math.sqrt(e*e*.7+o()*(t*t*1.05-e*e*.7)),m=o()*Math.PI*2,v=(o()*2-1)*n,g=Dv(u,m,v);o()>g*1.6||(s.set([u,m,v,o()],r*4),r++)}let c=new lt;c.setAttribute("position",new He(new Float32Array(r*3),3)),c.setAttribute("mod4",new He(s.subarray(0,r*4),4));let h=new Ge({vertexShader:bt+Lv,fragmentShader:Fv,uniforms:{...ce},blending:Zn,depthTest:!1,depthWrite:!1,transparent:!0}),p=new Ci(c,h);return p.frustumCulled=!1,p}var pr=class{constructor(e,t,n,s,r,a){this.center=n;this.halfW=s;this.halfH=r;this.depth=a;this.mat=new ht;this.proj=new ht;this.scene=new Zt;this.lastDir=new D(0,0,0);this.lastTime=-1e9;this.dirty=!0;this.rt=new yt(e,t,{type:Vt,format:Ii,minFilter:xt,magFilter:xt,depthBuffer:!0}),this.cam=new cn(-s,s,r,-r,1,a)}setDirection(e){let t=e.clone().normalize(),n=this.center.clone().addScaledVector(t,this.depth*.5);this.cam.position.copy(n);let s=Math.abs(t.y)>.9?new D(0,0,-1):new D(0,1,0);this.cam.up.copy(s),this.cam.lookAt(this.center),this.cam.updateMatrixWorld(),this.proj.makeOrthographic(-this.halfW,this.halfW,this.halfH,-this.halfH,1,this.depth),this.mat.multiplyMatrices(this.proj,this.cam.matrixWorldInverse),t.angleTo(this.lastDir)>.004&&(this.dirty=!0)}render(e,t,n=4){return!this.dirty&&t-this.lastTime<n?!1:(this.lastDir.copy(this.cam.position).sub(this.center).normalize(),this.lastTime=t,this.dirty=!1,of.value.copy(this.mat),e.setRenderTarget(this.rt),e.setClearColor(16777215,1),e.clear(!0,!0,!1),e.render(this.scene,this.cam),e.setClearColor(0,1),!0)}},of={value:new ht};function lf(i){return new Ge({vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,uniforms:{...i.uniforms,uShadowPassMat:of,tShadowKey:{value:null},tShadowStar:{value:null},tScene:{value:null}},defines:{...i.defines||{},SHADOW_PASS:1},side:2})}function Tc(i,e){for(let t of e){let n=t.material,s=new We(t.geometry,lf(n));s.matrixAutoUpdate=!1,s.matrix.copy(t.matrix),s.matrixWorld.copy(t.matrixWorld),s.frustumCulled=!1,i.scene.add(s)}}function Ac(i,e,t,n){let s=new Ri(t*2,t*2,n,n);s.rotateX(-Math.PI/2),s.translate(e.x,0,e.z);let r=new We(s,lf(i));return r.frustumCulled=!1,r}function cf(i,e){ut.tShadowKey.value=i.rt.texture,ut.uShadowKeyMat.value=i.mat,ut.uShadowKeyTexel.value.set(1/i.rt.width,1/i.rt.height),ut.tShadowStar.value=e.rt.texture,ut.uShadowStarMat.value=e.mat,ut.uShadowStarTexel.value.set(1/e.rt.width,1/e.rt.height)}var Nv=`
attribute vec4 iDrop; // \u5355\u4F4D\u4F53\u79EF\u5185\u7684\u4F4D\u7F6E (x, y, z) \u4E0E\u968F\u673A\u6570
uniform float uRain;
uniform vec2 uWind;
uniform float uTimeS;
uniform float uCount;
varying float vA;
varying vec2 vUv;
void main() {
  float idx = float(gl_InstanceID);
  // \u96E8\u5C0F\u65F6\u53EA\u663E\u793A\u4E00\u90E8\u5206\u96E8\u4E1D
  float show = step(idx, uCount * uRain * uRain * 0.9 + uCount * 0.1 * step(0.01, uRain));
  vec3 box = vec3(36.0, 26.0, 36.0);
  float fall = 8.5 + iDrop.w * 2.0;
  vec3 v = vec3(uWind.x * 0.8, -fall, uWind.y * 0.8);
  vec3 p = iDrop.xyz * box;
  p += v * uTimeS;
  // \u7ED5\u76F8\u673A\u53D6\u6A21
  vec3 c = cameraPosition;
  p = mod(p - c + box * 0.5, box) - box * 0.5 + c;
  // \u9762\u7247\uFF1A\u6CBF\u901F\u5EA6\u65B9\u5411\u62C9\u957F\uFF0C\u671D\u5411\u76F8\u673A
  vec3 dir = normalize(v);
  vec3 toCam = normalize(c - p);
  vec3 side = normalize(cross(dir, toCam));
  float len = 0.55 + 0.25 * iDrop.w;
  float wid = 0.008 + 0.004 * length(c - p) * 0.02;
  vec3 wp = p + dir * (position.y * len) + side * (position.x * wid);
  vA = show * (1.0 - smoothstep(10.0, 18.0, length(p - c))) * (0.5 + 0.5 * iDrop.w);
  vUv = position.xy;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}
`,Uv=`
uniform vec3 uMirrorE;
uniform vec3 uArchE;
uniform vec3 uAmbSky;
uniform float uNight;
varying float vA;
varying vec2 vUv;
void main() {
  if (vA <= 0.001) discard;
  float a = (1.0 - abs(vUv.x) * 2.0) * smoothstep(-0.5, 0.0, vUv.y) * (1.0 - smoothstep(0.2, 0.5, vUv.y));
  vec3 L = (uMirrorE * 0.06 + uAmbSky * 0.12 + uArchE * 0.15 + vec3(1.0, 0.75, 0.5) * 0.00012 * uNight);
  gl_FragColor = vec4(L * a * vA, 1.0);
}
`;function hf(i){let e=i>=2?9e3:i===1?6e3:3500,t=new en;t.setAttribute("position",new He(new Float32Array([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,-.5,0,.5,.5,0,-.5,.5,0]),3));let n=new Float32Array(e*4),s=99,r=()=>(s=s*1664525+1013904223>>>0,s/4294967296);for(let l=0;l<e;l++)n.set([r(),r(),r(),r()],l*4);t.setAttribute("iDrop",new Rt(n,4)),t.instanceCount=e;let a=new Ge({vertexShader:bt+Nv,fragmentShader:Uv,uniforms:{...ce,uCount:{value:e}},blending:Zn,transparent:!0,depthWrite:!1}),o=new We(t,a);return o.frustumCulled=!1,o.renderOrder=10,{mesh:o,update(){o.visible=ce.uRain.value>.01}}}var Ov=`
attribute float size;
uniform float uNight;
uniform float uPixAng;
varying float vI;
void main() {
  vec3 wp = position;
  vec4 c = viewMatrix * vec4(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z, 1.0);
  gl_Position = projectionMatrix * c;
  float dist = -c.z;
  // \u706F\u5934\u7EA6 0.5 m\uFF1A\u50CF\u7D20\u5C3A\u5BF8
  float px = 0.5 / max(dist * uPixAng, 1e-4);
  float s = max(px, 1.6);
  gl_PointSize = s * 2.5;
  // \u80FD\u91CF\u5B88\u6052\uFF1A\u5C0F\u4E8E\u4E00\u4E2A\u50CF\u7D20\u65F6\u964D\u4F4E\u4EAE\u5EA6
  float on = smoothstep(0.25, 0.55, uNight);
  vI = on * size * min(1.0, px * px / (s * s) * 4.0 + 0.15) * exp(-dist / 9000.0);
}
`,Bv=`
varying float vI;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float r = length(q) * 2.5;
  float core = exp(-r * r * 6.0);
  float halo = exp(-r * 2.2) * 0.12;
  vec3 c = vec3(1.0, 0.76, 0.5) * vI * (core * 0.35 + halo * 0.05);
  if (vI <= 0.0) discard;
  gl_FragColor = vec4(c, 1.0);
}
`;function uf(i){let e=i.lamps.length,t=new Float32Array(e*3),n=new Float32Array(e);i.lamps.forEach((o,l)=>{t.set([o.x+.3,o.y+o.h-.1,o.z],l*3),n[l]=o.h>7?1:.7});let s=new lt;s.setAttribute("position",new He(t,3)),s.setAttribute("size",new He(n,1));let r=new Ge({vertexShader:Ov,fragmentShader:Bv,uniforms:{...ce},blending:Zn,transparent:!0,depthWrite:!1}),a=new Ci(s,r);return a.frustumCulled=!1,a.renderOrder=5,a}var ff=`
#ifdef VERTEX
attribute vec4 iBlade; // x, y, z, \u9AD8\u5EA6
attribute vec4 iVar;   // \u671D\u5411, \u5F2F\u66F2, \u8272\u5DEE, \u82B1
uniform float uTimeS;
uniform vec2 uWind;
varying vec3 vW;
varying vec3 vN;
varying float vT;
varying vec2 vVar;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  float t = position.y;          // 0..1 \u6CBF\u53F6\u7247
  float side = position.x;       // -1..1
  float h = iBlade.w;
  float a = iVar.x;
  vec2 dir = vec2(cos(a), sin(a));
  float w = (0.016 + 0.01 * iVar.z) * (1.0 - t * 0.85);
  float wind = length(uWind);
  vec2 wd = wind > 0.01 ? uWind / wind : vec2(1.0, 0.0);
  float gust = 0.55 + 0.45 * sin(uTimeS * 1.7 + iBlade.x * 0.31 + iBlade.z * 0.23) * sin(uTimeS * 0.43 + iBlade.x * 0.05);
  float bend = iVar.y + (0.06 + 0.04 * wind) * gust;
  vec2 off = (dir * iVar.y + wd * (0.04 + 0.035 * wind) * gust) * t * t * h;
  vec3 p = vec3(iBlade.x, iBlade.y, iBlade.z);
  vec2 perp = vec2(-dir.y, dir.x);
  p.xz += perp * side * w + off;
  p.y += t * h * (1.0 - 0.3 * bend * bend);
  vW = p;
  vN = normalize(vec3(dir.x * 0.4, 0.8, dir.y * 0.4) + vec3(perp.x, 0.0, perp.y) * side * 0.3);
  vT = t;
  vVar = iVar.zw;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif
#ifdef FRAGMENT
uniform vec4 uSeasonA;
uniform vec4 uSeasonD;
varying vec3 vW;
varying vec3 vN;
varying float vT;
varying vec2 vVar;
void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  SHADOW_OUT(vW)
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 base = mix(vec3(0.05, 0.09, 0.03), vec3(0.11, 0.17, 0.05), vVar.x);
  base = mix(base, vec3(0.13, 0.21, 0.05), uSeasonA.w * 0.6);
  base = mix(base, vec3(0.2, 0.17, 0.09), uSeasonA.z * (0.6 + 0.4 * vVar.x));
  vec3 alb = mix(base * 0.55, base, vT);
  // \u91CE\u82B1\uFF08\u6625\u590F\uFF09
  float flower = step(0.965, vVar.y) * step(0.82, vT) * (uSeasonA.w * 0.7 + uSeasonD.z + 0.25) * (1.0 - uSeasonA.z);
  vec3 fc = vVar.y > 0.985 ? vec3(0.7, 0.62, 0.15) : (vVar.y > 0.975 ? vec3(0.6, 0.58, 0.62) : vec3(0.42, 0.3, 0.55));
  alb = mix(alb, fc, sat(flower));
  float cs = cloudShadow(vW.xz * 0.001);
  vec3 col = shade(alb, N, vW, mix(0.45, 1.0, vT), 0.85, uWet * 0.25, cs, 1.0);
  // \u900F\u5149
  col += alb * uMirrorE * cs * 0.12 * vT;
  col = applyAtmos(col, vW);
  gl_FragColor = vec4(col, 1.0);
}
#endif
`;function df(i,e){let t=e>=2?9e4:e===1?52e3:22e3,n=[-1,0,0,1,0,0,-1,.5,0,1,0,0,1,.5,0,-1,.5,0,-1,.5,0,1,.5,0,0,1,0],s=new en;s.setAttribute("position",new He(new Float32Array(n),3));let r=new Float32Array(t*4),a=new Float32Array(t*4),o=4242,l=()=>(o=o*1664525+1013904223>>>0,o/4294967296),c=0,h=0;for(;c<t&&h<t*4;){h++;let u=.5+Math.pow(l(),2)*30,m=l()*Math.PI*2,v=Math.cos(m)*u-2,g=Math.sin(m)*u;if(Math.abs(g-v*.6)<.9&&v>2&&v<40&&l()<.85)continue;let d=Math.hypot(v,g),x=Math.max(0,Math.min(1,(d-50)/210)),M=i.height(v,g)+(Vi(v*.33,g*.33)-.5)*.22*(1-x*x*(3-2*x));if(M<-20)continue;let b=.07+Math.pow(l(),1.8)*.26+(u>12?.06:0);r.set([v,M-.02,g,b],c*4),a.set([l()*Math.PI*2,(l()-.5)*.5,l(),l()],c*4),c++}s.setAttribute("iBlade",new Rt(r.subarray(0,c*4),4)),s.setAttribute("iVar",new Rt(a.subarray(0,c*4),4)),s.instanceCount=c,s.boundingSphere=new St(new D(0,0,0),40);let p=new Ge({vertexShader:`#define VERTEX
`+bt+ff,fragmentShader:`#define FRAGMENT
`+tn+ff,uniforms:{...ce,...ut},side:2});return new We(s,p)}var Xi=()=>new Promise(i=>requestAnimationFrame(()=>i())),zo=class{constructor(e,t){this.opts=t;this.t=0;this.speed=1;this.paused=!1;this.viewProj=new ht;this.exposure=3;this.exposureTarget=3;this.last=0;this.elapsed=0;this.fade=1;this.jump=null;this.frameMs=16;this.onFrame=null;this.ready=!1;this.exposureSnap=!1;this.keyDir=new D;this.starDir=new D;this.glareV=new D;this.pipe=new Mo(e),this.pipe.samples=t.quality>=1?4:0,this.rig=new bo(this.pipe.camera,e,{yaw:.12,pitch:.06,fov:58}),this.rig.setHome({yaw:.12,pitch:.06,fov:58})}async init(e){let t=this.opts.onProgress??(()=>{}),n=performance.now(),s=(g,f)=>{let d=performance.now();console.log(`[init] ${g} (+${(d-n).toFixed(0)} ms)`),n=d,t(g,f)},r=this.opts.quality;if(this.t=e,this.weather=new Ro(e),this.weather.snap(e),this.opts.lite)return this.initLite(r);s("\u6D4B\u7ED8\u6CB3\u8C37\u5730\u5F62",.08),await Xi(),this.terrain=new Oo(this.pipe.renderer),s("\u94FA\u8BBE\u5730\u8868",.3),await Xi();let a=Hu(this.terrain,r);for(let g of a)this.pipe.sceneMain.add(g);s("\u4FEE\u5EFA\u5C0F\u9547\u4E0E\u5B66\u6821",.42),await Xi(),this.town=Wu(this.terrain),ut.tTown.value=this.town.texture,ut.uTownGrid.value.set(ft.x0,ft.z0,ft.size,ft.res);let o=Ku(this.town);for(let g of o)this.pipe.sceneMain.add(g);s("\u79CD\u6811",.6),await Xi();let l=Qu(this.terrain,this.town,r),c=tf(l);for(let g of c)this.pipe.sceneMain.add(g);this.pipe.sceneMain.add(df(this.terrain,r)),s("\u5F15\u6C34\u5165\u6CB3\u3001\u94FA\u8F68\u901A\u8F66",.75),await Xi();let h=Ju(this.terrain);this.pipe.sceneWater.add(h.mesh),this.waterMat=h.mat,h.mat.uniforms.uViewProj.value=this.viewProj,this.rail=af(this.terrain);for(let g of this.rail.meshes)this.pipe.sceneMain.add(g);s("\u60AC\u6302\u955C\u4E91",.85),await Xi(),this.pipe.sceneSpace.add(wc(r>=2?36e3:r===1?22e3:12e3)),ce.uHasSpace.value=1,this.rain=hf(r),this.pipe.sceneFx.add(this.rain.mesh),this.pipe.sceneFx.add(uf(this.town));let p=new D(1300,-60,250),u=r>=2?4096:2048;this.keyShadow=new pr(u,u,p,2e3,2e3,6e3),this.starShadow=new pr(u,u/2,p,2600,900,3e4);let m=[...o,...c,...this.rail.meshes.filter(g=>g!==this.rail.train.mesh)];Tc(this.keyShadow,m),Tc(this.starShadow,m);let v=gc(this.terrain);this.keyShadow.scene.add(Ac(v,p,2e3,400)),this.starShadow.scene.add(Ac(v,p,4500,500)),cf(this.keyShadow,this.starShadow),ut.uShadowKeyOn.value=1,s("\u70B9\u4EAE\u5929\u7A7A",.95),await Xi(),this.resize(),this.update(0),this.exposure=this.exposureTarget,this.ready=!0}async initLite(e){this.pipe.sceneSpace.add(wc(e>=2?36e3:e===1?22e3:12e3)),ce.uHasSpace.value=1,this.rail={meshes:[],train:{update(){},mesh:null}},this.rain={mesh:null,update(){}},this.waterMat=new Ge({uniforms:{tScene:{value:null},uViewProj:{value:null}}}),this.keyShadow={setDirection(){},render(){return!1}},this.starShadow=this.keyShadow,this.resize(),this.update(0),this.exposure=this.exposureTarget,this.ready=!0}resize(e=this.pipe.scale){this.pipe.setSize(window.innerWidth,window.innerHeight,e)}setWeather(e){this.weather.setMode(e)}jumpTo(e,t=0){if(t<=0){this.t=e,this.weather.snap(e),this.jump=null,this.exposureSnap=!0;return}this.jump={from:this.t,to:e,t0:performance.now()/1e3,dur:t}}flash(){this.fade=0}update(e){let t=performance.now()/1e3,n=0;if(this.jump){let s=Math.min(1,(t-this.jump.t0)/this.jump.dur),r=s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2,a=this.jump.from+(this.jump.to-this.jump.from)*r;n=a-this.t,this.t=a,s>=1&&(this.jump=null)}else this.paused||(n=e*this.speed/86400,this.t+=n);if(this.elapsed+=e,this.weather.update(this.t,Math.max(0,n),e),this.light=Du(this.t,this.weather.state),this.rig.update(e),this.pipe.updateViewUniforms(),this.exposureTarget=3/Math.pow(this.light.sceneE+1e-5,.72),this.exposureSnap)this.exposure=this.exposureTarget,this.exposureSnap=!1;else{let s=1-Math.exp(-e*(Math.abs(n)>1e-4?6:1.6));this.exposure=Math.exp(Math.log(this.exposure)+(Math.log(this.exposureTarget)-Math.log(this.exposure))*s)}this.fade=Math.min(1,this.fade+e*2.5)}render(){if(!this.ready)return;let e=performance.now(),t=this.last?Math.min(.1,(e-this.last)/1e3):.016;this.last=e,this.update(t),this.onFrame?.(t);let n=this.pipe,s=n.post.composite.uniforms;s.uExposure.value=this.exposure,ce.uFarComp.value=Math.max(0,this.exposure-20)*.45,s.uNightVis.value=Math.max(0,Math.min(1,1-this.light.sceneE*40)),s.uTime.value=this.elapsed,s.uFade.value=this.fade,this.updateGlare(),this.rail.train.update(this.t),this.rain.update(n.camera,t),this.viewProj.multiplyMatrices(n.camera.projectionMatrix,n.camera.matrixWorldInverse),this.waterMat.uniforms.tScene.value=n.copyRT.texture;let r=ce.uMirrorE.value.y,a=ce.uArchE.value.y;this.keyDir.copy(ce.uMirrorDir.value).multiplyScalar(r+1e-6).addScaledVector(ce.uArchDir.value,a*1.5).normalize(),this.keyDir.y<.3&&this.keyDir.set(this.keyDir.x,.3,this.keyDir.z).normalize(),this.keyShadow.setDirection(this.keyDir),this.keyShadow.render(n.renderer,this.elapsed,6);let o=this.light.starGround>1e-6||ce.uStarE.value.x>0&&this.light.star.margin>-.004;ut.uShadowStarOn.value=o?1:0,o&&(this.starDir.copy(ce.uStarDir.value),this.starShadow.setDirection(this.starDir),this.starShadow.render(n.renderer,this.elapsed,1.5)),n.renderEnv(),n.renderSpace(),n.renderMain(),n.copyForWater(),n.renderWaterAndFx(),n.renderPost(),this.frameMs=this.frameMs*.92+(performance.now()-e)*.08}updateGlare(){let e=this.pipe.post.composite.uniforms,t=ce.uStarDir.value,n=this.light.starFrac;if(n<=0||ce.uStarE.value.x<=0){e.uGlarePos.value.set(0,0,0);return}let s=this.pipe.camera;this.glareV.copy(t).multiplyScalar(1e3).add(s.position).project(s);let r=this.glareV.z<1&&this.glareV.z>-1,a=n*60*Math.exp(-1.2);e.uGlarePos.value.set(this.glareV.x*.5+.5,this.glareV.y*.5+.5,r?a:0),e.uGlareAspect.value=s.aspect}};var dt=i=>document.getElementById(i);function zv(i){let e=["\u4E1C","\u4E1C\u5357","\u5357","\u897F\u5357","\u897F","\u897F\u5317","\u5317","\u4E1C\u5317"],t=Math.round((i%(Math.PI*2)+Math.PI*2)/(Math.PI/4))%8;return e[t]}function pf(i){if(i<1)return Math.max(1,Math.round(i*60))+" \u79D2";if(i<60)return Math.round(i)+" \u5206\u949F";let e=i/60;return e<48?(e<10?e.toFixed(1):Math.round(e))+" \u5C0F\u65F6":Math.round(e/24)+" \u5929"}var mr=[1,10,60,600,3600],kv=["\u5B9E\u65F6","\xD710","\xD760","\xD7600","\xD73600"];function mf(i,e){let t=dt("ui"),n=dt("show-ui"),s=dt("toast"),r=0,a=(L,B=3600)=>{s.textContent=L,s.classList.add("on"),clearTimeout(r),r=window.setTimeout(()=>s.classList.remove("on"),B)},o=(L,B,J,ie,ee="")=>{let Re=document.createElement("button");return Re.className="chip "+ee,Re.textContent=B,ie&&(Re.title=ie),Re.addEventListener("click",J),L.appendChild(Re),Re},l=L=>{let B=document.createElement("span");B.className="sep",L.appendChild(B)},c=dt("speeds"),h=mr.map((L,B)=>o(c,kv[B],()=>{i.speed=L,i.paused=!1,Z()},B===0?"\u4E0E\u771F\u5B9E\u65F6\u95F4\u540C\u6B65\u6D41\u901D":`\u4E00\u79D2\u949F\u8FC7\u53BB ${L>=3600?L/3600+" \u5C0F\u65F6":L>=60?L/60+" \u5206\u949F":L+" \u79D2"}`)),p=dt("btn-play");p.addEventListener("click",()=>{i.paused=!i.paused,Z()});let u=dt("presets"),m=[["\u6E05\u6668",5.9,"04:30 \u8D77\u955C\u4E91\u6E10\u4EAE"],["\u767D\u663C",11,"07:30\u201416:30 \u7EF4\u6301\u767D\u663C"],["\u9EC4\u660F",18.1,"16:30 \u8D77\u955C\u4E91\u6E10\u6697"],["\u591C\u665A",22.6,"\u5BF9\u5CB8\u5149\u7167\u7740\u6CB3\u8C37"]],v=L=>{let B=Ot(i.t),J=Math.floor(i.t)+L/24;J<=i.t+1e-6&&(J+=1);let ie=(J-i.t)*24;i.jumpTo(J,Math.min(3.2,.8+ie*.12))};m.forEach(([L,B,J])=>o(u,L,()=>v(B),J));let g=dt("peeks"),f=[],d=-1,x=()=>{let L=Ot(i.t);L.year!==d&&(d=L.year,f=hc(xs(L.year)-1),f=f.concat(hc(xs(L.year+1)-1).filter(B=>B.start>f[f.length-1]?.end)),H())},M=L=>{x();let B=f.find(te=>te.kind===L&&i.t>=te.start-.5&&i.t<=te.end),J=null;if(B&&(J=hr(i.t+2/1440,30),J&&J.kind!==L&&(J=null)),!J){let te=f.find(ne=>ne.kind===L&&ne.center>i.t)??f.find(ne=>ne.kind===L);if(!te)return;J=hr(te.center-.09,2)}if(!J)return;let ie=100/86400;i.flash(),i.jumpTo(J.start-ie),i.speed=6,i.paused=!1,i.rig.lookAt(.62,.075,64);let ee=Ot(J.peak),Re=(J.end-J.start)*1440,I=vi(ee.hour)>.5?"\u4EBA\u5DE5\u767D\u663C":vi(ee.hour)>0?"\u955C\u4E91\u8C03\u5149\u65F6":"\u6DF1\u591C";a(`${L==="spring"?"\u6625\u7167":"\u79CB\u7167"}\uFF1A${ee.month} \u6708 ${ee.day} \u65E5 ${To(ee.hour)}\uFF0C\u6B63\u503C${I}\u3002\u6052\u661F\u4E0A\u7F18\u5C06\u8D8A\u8FC7\u5357\u5899\u7EA6 ${Re.toFixed(1)} \u5206\u949F\uFF08\u65F6\u95F4\u653E\u6162\u5230 \xD76\uFF09`,6500),Z()};o(g,"\u6625\u7167",()=>M("spring"),"\u8DF3\u5230\u4E0B\u4E00\u6B21\u6625\u7167\uFF1A\u6052\u661F\u4E0A\u7F18\u8D8A\u8FC7\u5357\u5899","warm"),o(g,"\u79CB\u7167",()=>M("autumn"),"\u8DF3\u5230\u4E0B\u4E00\u6B21\u79CB\u7167","warm");let b=dt("seasons"),w=[["\u6625",4,18],["\u590F",7,12],["\u79CB",10,26],["\u51AC",1,16]].map(([L,B,J])=>o(b,L,()=>{let ie=Ot(i.t);i.flash(),i.jumpTo(wo(ie.year,B,J,ie.hour)),Z()},`${B} \u6708 ${J} \u65E5`)),C=dt("weathers"),_=[];_.push(o(C,"\u81EA\u52A8",()=>S("auto"),"\u6309\u5B63\u8282\u81EA\u7136\u53D8\u5316"));for(let L of Po)_.push(o(C,Io[L],()=>S(L)));let S=L=>{if(i.setWeather(L),L==="fog"){let B=Ot(i.t).hour;B>10.5&&B<21&&a("\u6CB3\u8C37\u6668\u96FE\u5728\u6E05\u6668\u6700\u6D53\u2014\u2014\u53EF\u70B9\u300C\u6E05\u6668\u300D\u53BB\u770B")}Z()},U=dt("day-track"),R=dt("day-thumb"),F=dt("year-track"),O=dt("year-thumb"),G=(L,B)=>{let J=!1,ie=(ee,Re)=>{let I=L.getBoundingClientRect(),te=Math.max(0,Math.min(.99999,(ee.clientX-I.left)/I.width));B(te,Re)};L.addEventListener("pointerdown",ee=>{J=!0,L.setPointerCapture(ee.pointerId),ie(ee,!1)}),L.addEventListener("pointermove",ee=>J&&ie(ee,!1)),L.addEventListener("pointerup",ee=>{J&&ie(ee,!0),J=!1})};G(U,L=>{i.jumpTo(Math.floor(i.t)+L)}),G(F,(L,B)=>{let J=Ot(i.t),ie=xs(J.year),ee=Math.floor(L*Jn(J.year));i.jumpTo(ie+ee+J.hour/24),B&&i.flash()});let H=()=>{let L=dt("year-wins");L.innerHTML="";let B=xs(d),J=Jn(d);for(let ie of f){let ee=(ie.start-B)/J,Re=(ie.end-B)/J;if(Re<0||ee>1)continue;let I=document.createElement("b");I.style.left=ee*100+"%",I.style.width=Math.max(.3,(Re-ee)*100)+"%",I.title=`${ie.kind==="spring"?"\u6625\u7167":"\u79CB\u7167"}\u7A97\u53E3\uFF1A\u7EA6 ${(ie.end-ie.start).toFixed(1)} \u65E5\uFF0C\u6700\u957F\u4E00\u6B21 ${ie.longest.toFixed(1)} \u5206\u949F`,L.appendChild(I);let te=document.createElement("em");te.style.left=(ee+Re)/2*100+"%",te.textContent=ie.kind==="spring"?"\u6625\u7167":"\u79CB\u7167",L.appendChild(te)}},V=dt("labels"),W=!1,re=dt("btn-labels"),se=()=>{W=!W,re.classList.toggle("on",W),V.innerHTML="",Me.clear()};re.addEventListener("click",se);let ge=dt("help"),ye=L=>{ge.hidden=L===void 0?!ge.hidden:!L};dt("btn-help").addEventListener("click",()=>ye()),dt("help-close").addEventListener("click",()=>ye(!1)),ge.addEventListener("click",L=>{L.target===ge&&ye(!1)});let me=()=>{document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.().catch(()=>{})};dt("btn-full").addEventListener("click",me);let Be=!1,st=0,rt=L=>{Be=L,t.classList.toggle("hidden",L),n.hidden=!L,L&&a("\u754C\u9762\u5DF2\u9690\u85CF \xB7 \u6309 H \u6216\u79FB\u52A8\u9F20\u6807\u540E\u70B9\u53F3\u4E0B\u89D2\u6062\u590D",2600)};dt("btn-hide").addEventListener("click",()=>rt(!0)),n.addEventListener("click",()=>rt(!1)),window.addEventListener("pointermove",()=>{Be&&(n.classList.add("visible"),clearTimeout(st),st=window.setTimeout(()=>n.classList.remove("visible"),2200))}),e&&(t.classList.add("hidden"),Be=!0),window.addEventListener("keydown",L=>{if(L.target instanceof HTMLInputElement)return;let B=L.key;if(B===" ")i.paused=!i.paused,Z(),L.preventDefault();else if(B==="h"||B==="H")rt(!Be);else if(B==="l"||B==="L")se();else if(B==="f"||B==="F")me();else if(B==="?"||B==="/")ye();else if(B==="Escape")ye(!1);else if(B>="1"&&B<="4")v(m[+B-1][1]);else if(B==="["||B==="]"){let J=mr.indexOf(i.speed);J<0&&(J=0),J=Math.max(0,Math.min(mr.length-1,J+(B==="]"?1:-1))),i.speed=mr[J],i.paused=!1,Z()}else B==="ArrowLeft"?i.rig.turn(-.12,0):B==="ArrowRight"?i.rig.turn(.12,0):B==="ArrowUp"?i.rig.turn(0,.08):B==="ArrowDown"?i.rig.turn(0,-.08):B==="+"||B==="="?i.rig.zoomBy(.8):(B==="-"||B==="_")&&i.rig.zoomBy(1.25)});function Z(){p.textContent=i.paused?"\u25B6":"\u275A\u275A",p.setAttribute("aria-label",i.paused?"\u7EE7\u7EED":"\u6682\u505C"),h.forEach((ie,ee)=>ie.classList.toggle("on",!i.paused&&i.speed===mr[ee]));let L=i.weather.mode;_.forEach((ie,ee)=>ie.classList.toggle("on",(ee===0?"auto":Po[ee-1])===L));let B=ar(Ot(i.t).month),J=[1,2,3,0];w.forEach((ie,ee)=>ie.classList.toggle("on",J[ee]===B))}Z();let ae=dt("compass-inner"),fe=()=>ae.parentElement.clientWidth,k=[],oe=[[0,"\u5317"],[45,"\u4E1C\u5317"],[90,"\u4E1C"],[135,"\u4E1C\u5357"],[180,"\u5357"],[225,"\u897F\u5357"],[270,"\u897F"],[315,"\u897F\u5317"]];for(let[L,B]of oe)k.push([L,B,L%90===0]);let ue=3.2;for(let L=-1;L<=1;L++){for(let[B,J,ie]of k){let ee=document.createElement("span");ee.textContent=J,ie&&(ee.className="major"),ee.style.left=(B+L*360)*ue+"px",ae.appendChild(ee)}for(let B=0;B<360;B+=15){let J=document.createElement("i");J.style.left=(B+L*360)*ue+"px",ae.appendChild(J)}}let Me=new Map,he=new D,Se=At.R,be=(L,B,J)=>new D(L,B,J).normalize(),pe=At.spokeLongitudes.map(L=>{let B=L*Math.PI/180;return be(Se*Math.sin(B),Se*(1-Math.cos(B)),0)}),P=(()=>{let L=[{id:"hub",text:"\u4E2D\u592E\u661F\u6E2F",sub:"\u73AF\u5FC3 \xB7 \u4E94\u4E07\u516C\u91CC",dir:be(.0012,1,6e-4),cls:"sky"},{id:"mirror",text:"\u4E2D\u592E\u955C\u4E91",sub:"\u8DDD\u73AF\u8F74 3000\u20137000 km",dir:be(.06,1,.07),cls:"sky"},{id:"far",text:"\u5BF9\u5CB8",sub:"\u4E0E\u6B64\u5730\u76F8\u5DEE\u534A\u4E2A\u663C\u591C",dir:be(Math.cos(80*Math.PI/180),Math.sin(80*Math.PI/180),0),cls:"sky"},{id:"wallS",text:"\u5357\u4FA7\u8FB9\u5899",sub:"\u9AD8 50 km \xB7 500 km \u5916 \xB7 \u671D\u5411\u6052\u661F",dir:be(.15,Math.tan(5.2*Math.PI/180),1),cls:"sky"},{id:"wallN",text:"\u5317\u4FA7\u8FB9\u5899",sub:"\u9AD8 50 km \xB7 500 km \u5916",dir:be(.15,Math.tan(5.2*Math.PI/180),-1),cls:"sky"},{id:"east",text:"\u4E1C \xB7 \u987A\u65CB\u65B9\u5411",sub:"\u5927\u5730\u5411\u4E0A\u5F2F\u8D77",dir:be(1,.06,0),cls:"sky"},{id:"west",text:"\u897F \xB7 \u9006\u65CB\u65B9\u5411",sub:"\u5927\u5730\u5411\u4E0A\u5F2F\u8D77",dir:be(-1,.06,0),cls:"sky"},{id:"school",text:"\u4E2D\u5B66",pos:new D(300,-40,-20)},{id:"station",text:"\u8F66\u7AD9",pos:new D(980,-48,-470)},{id:"bridge",text:"\u5927\u6865",pos:new D(1384,-54,560)},{id:"gap",text:"\u94C1\u8DEF\u51FA\u8C37\u53E3",sub:"\u7EA6 18 \u516C\u91CC",pos:new D(17800,-40,4600)}];return pe.forEach((B,J)=>{B.y>.05&&L.push({id:"spoke"+J,text:"\u8F90\u6761",sub:`\u843D\u70B9 ${Math.abs(At.spokeLongitudes[J]>180?At.spokeLongitudes[J]-360:At.spokeLongitudes[J])}\xB0${At.spokeLongitudes[J]>0&&At.spokeLongitudes[J]<180?"\u4E1C":"\u897F"}`,dir:B,cls:"sky"})}),L})(),it=()=>{if(!W)return;let L=i.pipe.camera,B=window.innerWidth,J=window.innerHeight,ie=[...P],ee=ce.uStarDir.value,Re=i.light.starFrac>0;ie.push({id:"star",text:"\u6052\u661F",sub:Re?"\u4E0A\u7F18\u6B63\u8D8A\u8FC7\u5357\u5899":i.light.star.elevation>0?"\u5728\u5357\u5899\u4E4B\u540E":"\u5728\u5730\u5E73\u4E4B\u4E0B",dir:new D(ee.x,ee.y,ee.z),cls:"warm"});let I=new Set;for(let te of ie){if(te.dir?he.copy(te.dir).multiplyScalar(1e3).add(L.position):te.pos&&he.copy(te.pos),he.project(L),he.z>1||he.z<-1||Math.abs(he.x)>1.05||Math.abs(he.y)>1.05)continue;let ne=Me.get(te.id);ne||(ne=document.createElement("div"),ne.className="lb "+(te.cls??""),V.appendChild(ne),Me.set(te.id,ne)),ne.innerHTML=te.text+(te.sub?`<small>${te.sub}</small>`:""),ne.style.left=((he.x*.5+.5)*B).toFixed(1)+"px",ne.style.top=((-he.y*.5+.5)*J).toFixed(1)+"px",ne.style.display="",I.add(te.id)}for(let[te,ne]of Me)I.has(te)||(ne.style.display="none")},Ve=dt("clock"),je=dt("date"),Ee=dt("phase"),E=dt("wx"),y=dt("ring"),N=dt("peek"),j=dt("compass-elev"),Q=null,K=-1,we=0,de=i.t,Le=()=>{let L=i.t,B=Ot(L);Ve.textContent=To(B.hour,i.speed<=10&&!i.paused);let J=yu[ar(B.month)];je.textContent=`\u73AF\u5386 ${B.year} \u5E74 ${B.month} \u6708 ${B.day} \u65E5 \xB7 ${J}`;let ie=vi(B.hour),ee=Ui(B.hour),Re;ie<=0?Re="\u591C \xB7 \u5BF9\u5CB8\u5149\u7167\u7740\u6CB3\u8C37":ie>=1?Re="\u767D\u663C \xB7 \u955C\u5149\u81EA\u5934\u9876\u6D12\u4E0B":B.hour<12?Re=`\u955C\u4E91\u6E10\u4EAE \xB7 \u5149\u7167 ${Math.round(ee*100)}%`:Re=`\u955C\u4E91\u6E10\u6697 \xB7 \u5149\u7167 ${Math.round(ee*100)}%`,Ee.textContent=Re;let I=i.weather.state,te=bu(L,I.cover,I.rain,I.fogNow),ne=zv(I.windDir+Math.PI),Te=i.weather.mode==="auto"?Io[I.kind]:Io[i.weather.mode],le=I.rain>.05?` \xB7 ${I.rain>.5?"\u96E8\u52BF\u8F83\u5927":"\u5C0F\u96E8"}`:"";E.textContent=`${Te}${le} \xB7 ${te.toFixed(1)}\u2103 \xB7 ${ne}\u98CE ${I.wind.toFixed(1)} m/s`;let $=cr(Bi(L))*180/Math.PI;y.textContent=`\u73AF\u4F53\u81EA\u8F6C ${$.toFixed(0)}\xB0 \xB7 \u6BCF 3 \u5C0F\u65F6 56 \u5206\u4E00\u5708 \xB7 \u516C\u8F6C\u7B2C ${Math.floor(B.doy)+1} \u65E5`,x(),(!Q||L>Q.end||L<K-1e-6||Math.abs(L-de)>.5)&&(Q=hr(L,400),K=L),de=L,N.classList.remove("now");let Ae=f.find(Ue=>L>=Ue.start&&L<=Ue.end+.02);if(Q&&L>=Q.start&&L<=Q.end){let Ue=(Q.end-L)*1440;N.textContent=`${Q.kind==="spring"?"\u6625\u7167":"\u79CB\u7167"}\uFF1A\u6052\u661F\u4E0A\u7F18\u6B63\u8D8A\u8FC7\u5357\u5899 \xB7 \u8FD8\u6709 ${pf(Ue)}`,N.classList.add("now")}else if(Ae&&Q){let Ue=Math.floor(L-Ae.start)+1,pt=Math.ceil(Ae.end-Ae.start),tt=Ot(Q.start);N.textContent=`${Ae.kind==="spring"?"\u6625\u7167":"\u79CB\u7167"}\u7A97\u53E3\u7B2C ${Ue}/${pt} \u65E5 \xB7 \u4E0B\u6B21\u9732\u661F ${tt.month===B.month&&tt.day===B.day?"":tt.month+"\u6708"+tt.day+"\u65E5 "}${To(tt.hour)}\uFF0C\u7EA6 ${((Q.end-Q.start)*1440).toFixed(1)} \u5206\u949F`}else if(Q){let Ue=Q.start-L;N.textContent=`\u8DDD${Q.kind==="spring"?"\u6625\u7167":"\u79CB\u7167"}\u8FD8\u6709 ${pf(Ue*1440)}`}else N.textContent="";Z()},Oe=()=>{let L=performance.now(),B=Ot(i.t);R.style.left=B.hour/24*100+"%",O.style.left=B.doy/B.yearLength*100+"%";let J=i.rig.heading();ae.style.transform=`translateX(${fe()/2-J*ue}px)`;let ie=i.rig.view.pitch*180/Math.PI;j.style.display=Math.abs(ie)>20?"block":"none",j.textContent=`\u4EF0\u89D2 ${ie.toFixed(0)}\xB0`,L-we>120&&(we=L,Le()),it()};return Le(),{update:Oe}}var Mn=new URLSearchParams(location.search);function Nn(i,e){let t=Mn.get(i);return t===null||t===""?e:parseFloat(t)}function Gv(){if(Mn.has("q"))return Nn("q",2);let i=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent),e=navigator.hardwareConcurrency||4;return i?0:e>=8?2:1}async function Vv(){let i=document.getElementById("view"),e=document.getElementById("loading"),t=document.getElementById("loading-bar"),n=document.getElementById("loading-msg"),s=Gv(),r=new zo(i,{quality:s,lite:Mn.has("lite"),onProgress:(b,A)=>{n&&(n.textContent=b),t&&(t.style.width=Math.round(A*100)+"%")}}),a=new Date,o=Nn("month",a.getMonth()+1),l=Nn("day",a.getDate()),c=wo(1127,o,l,Nn("hour",10));try{await r.init(c)}catch(b){console.error(b),n&&(n.textContent="\u521D\u59CB\u5316\u5931\u8D25\uFF1A"+b.message);return}let h=Mn.get("weather");h&&(r.setWeather(h),r.weather.snap(r.t)),Mn.has("yaw")&&r.rig.lookAt(Nn("yaw",0)*Math.PI/180,Nn("pitch",4)*Math.PI/180,Nn("fov",58)),Mn.has("speed")&&(r.speed=Nn("speed",1)),Mn.has("paused")&&(r.paused=!0),r.jumpTo(r.t),r.rig.view={...r.rig.targetView};let p=Nn("scale",1);r.resize(p),window.addEventListener("resize",()=>r.resize());let u=mf(r,Mn.has("noui"));e?.classList.add("done"),setTimeout(()=>e?.remove(),1200);let m=p,v=0,g=0,f=performance.now(),d=performance.now(),x=!Mn.has("scale"),M=()=>{if(window.__stop)return;let b=performance.now(),A=b-f;if(f=b,x&&A<500&&(v+=A,g++,b-d>2500&&g>20)){let w=v/g,C=m;w>30?C=Math.max(.5,m*.85):w<17.5&&m<1&&(C=Math.min(1,m*1.1)),Math.abs(C-m)>.01&&(m=C,r.resize(m)),v=0,g=0,d=b}Mn.has("cover")&&(ce.uCloudCover.value=Nn("cover",0)),Mn.has("nospace")&&(ce.uHasSpace.value=0),r.render(),u.update(),window.__frames=(window.__frames||0)+1,requestAnimationFrame(M)};requestAnimationFrame(M),window.app=r,window.dumpSpace=()=>{let b=r.pipe.spaceRT,A=b.width,w=b.height,C=new Uint16Array(A*w*4);r.pipe.renderer.readRenderTargetPixels(b,0,0,A,w,C);let _=0,S=0,U=0,R=F=>{let O=F>>10&31,G=F&1023,H=F>>15?-1:1;return O===0?H*G*Math.pow(2,-24):O===31?G?NaN:H*(1/0):H*(1+G/1024)*Math.pow(2,O-15)};for(let F=0;F<A*w;F++){let O=R(C[F*4]);(O>_||Number.isNaN(O))&&(_=O),S+=O,O>1e-6&&U++}return{w:A,h:w,max:_,mean:S/(A*w),nonzero:U,center:R(C[((w>>1)*A+(A>>1))*4])}}}Vv();})();
