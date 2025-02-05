var e,t=require("@chriscdn/to-date"),r=require("@chriscdn/memoize"),a=require("get-user-locale");function n(){return n=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)({}).hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},n.apply(null,arguments)}exports.FormatDatePreset=void 0,(e=exports.FormatDatePreset||(exports.FormatDatePreset={}))[e.None=0]="None",e[e.DateTime=1]="DateTime",e[e.DateTimeShort=2]="DateTimeShort",e[e.Date=3]="Date",e[e.DateMedium=4]="DateMedium",e[e.DateShort=5]="DateShort";var o=r.Memoize(function(e,t){return new Intl.DateTimeFormat(e,t)},{maxSize:20}),i=r.Memoize(function(e,t){return new Intl.RelativeTimeFormat(e,t)},{maxSize:20}),u=r.Memoize(function(e,r,a,n){var i=t.toDate(e,a),u=o(r,n);return t.isDate(i)?u.format(i):void 0}),s=r.Memoize(function(e,t,r,a){return i(r,a).format(e,t)}),c=r.Memoize(function(e){var t;return(null!=(t=e.locale)?t:a.getUserLocale({fallbackLocale:"en-GB"})).replace("_","-")}),m=r.Memoize(function(e,r){if(void 0===r&&(r={}),null==e)return null;var a,o,i,s=c(r),m=null!=(a=r.preset)?a:exports.FormatDatePreset.DateTime,l=null!=(o=r.epochUnit)?o:t.EpochUnit.BESTGUESS,d=null!=(i=r.formatOptions)?i:{},D=function(e){switch(e){case exports.FormatDatePreset.None:return{};case exports.FormatDatePreset.DateTime:return{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"numeric"};case exports.FormatDatePreset.DateTimeShort:return{dateStyle:"short",timeStyle:"short"};case exports.FormatDatePreset.Date:return{year:"numeric",month:"long",day:"2-digit"};case exports.FormatDatePreset.DateMedium:return{year:"numeric",month:"short",day:"2-digit"};case exports.FormatDatePreset.DateShort:return{year:"numeric",month:"2-digit",day:"2-digit"};default:return{dateStyle:"full"}}}(m),h=n({},D,d);return u(e,s,l,h)}),l=r.Memoize(function(e){var r=t.toDate(e);if(r){var a=r.getFullYear(),n=r.getMonth()+1,o=r.getDate();return[a,n.toString().padStart(2,"0"),o.toString().padStart(2,"0")].join("-")}return null}),d=r.Memoize(function(e){var r=t.toDate(e);if(r){var a=r.getFullYear(),n=r.getMonth()+1,o=r.getDate(),i=r.getHours(),u=r.getMinutes(),s=r.getSeconds();return[[a,n.toString().padStart(2,"0"),o.toString().padStart(2,"0")].join("-"),[i.toString().padStart(2,"0"),u.toString().padStart(2,"0"),s.toString().padStart(2,"0")].join(":")].join("T")}return null});exports.formatDate=m,exports.formatDateYYYYMMDD=l,exports.formatDateYYYYMMDDTHHMMSS=d,exports.formateRelativeDate=function(e,r){if(void 0===r&&(r={}),null==e)return null;var a,n,o,i=c(r),u=null!=(a=r.epochUnit)?a:t.EpochUnit.BESTGUESS,m=null!=(n=r.formatOptions)?n:{},l=new Date,d=t.toDate(e,u),D=Math.round((d.getTime()-l.getTime())/1e3),h=Math.abs(D),S=function(e,t){switch(t){case"year":case"years":return Math.round(e/31536e3);case"quarter":case"quarters":return Math.round(e/7884e3);case"month":case"months":return Math.round(e/2629800);case"week":case"weeks":return Math.round(e/604800);case"day":case"days":return Math.round(e/86400);case"hour":case"hours":return Math.round(e/3600);case"minute":case"minutes":return Math.round(e/60);case"second":case"seconds":return e}}(D,o=r.unit?r.unit:h<60?"second":h<3600?"minute":h<86400?"hour":h<2592e3?"day":h<31536e3?"month":"year");return s(S,o,i,m)};
//# sourceMappingURL=format-date.cjs.map
