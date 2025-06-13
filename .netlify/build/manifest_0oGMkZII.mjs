import { N as NOOP_MIDDLEWARE_HEADER, k as decodeKey } from './chunks/astro/server_BdsJqvHa.mjs';

var dist = {};

var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist;
	hasRequiredDist = 1;
	Object.defineProperty(dist, "__esModule", { value: true });
	dist.parse = parse;
	dist.serialize = serialize;
	/**
	 * RegExp to match cookie-name in RFC 6265 sec 4.1.1
	 * This refers out to the obsoleted definition of token in RFC 2616 sec 2.2
	 * which has been replaced by the token definition in RFC 7230 appendix B.
	 *
	 * cookie-name       = token
	 * token             = 1*tchar
	 * tchar             = "!" / "#" / "$" / "%" / "&" / "'" /
	 *                     "*" / "+" / "-" / "." / "^" / "_" /
	 *                     "`" / "|" / "~" / DIGIT / ALPHA
	 *
	 * Note: Allowing more characters - https://github.com/jshttp/cookie/issues/191
	 * Allow same range as cookie value, except `=`, which delimits end of name.
	 */
	const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
	/**
	 * RegExp to match cookie-value in RFC 6265 sec 4.1.1
	 *
	 * cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
	 * cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
	 *                     ; US-ASCII characters excluding CTLs,
	 *                     ; whitespace DQUOTE, comma, semicolon,
	 *                     ; and backslash
	 *
	 * Allowing more characters: https://github.com/jshttp/cookie/issues/191
	 * Comma, backslash, and DQUOTE are not part of the parsing algorithm.
	 */
	const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
	/**
	 * RegExp to match domain-value in RFC 6265 sec 4.1.1
	 *
	 * domain-value      = <subdomain>
	 *                     ; defined in [RFC1034], Section 3.5, as
	 *                     ; enhanced by [RFC1123], Section 2.1
	 * <subdomain>       = <label> | <subdomain> "." <label>
	 * <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]
	 *                     Labels must be 63 characters or less.
	 *                     'let-dig' not 'letter' in the first char, per RFC1123
	 * <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>
	 * <let-dig-hyp>     = <let-dig> | "-"
	 * <let-dig>         = <letter> | <digit>
	 * <letter>          = any one of the 52 alphabetic characters A through Z in
	 *                     upper case and a through z in lower case
	 * <digit>           = any one of the ten digits 0 through 9
	 *
	 * Keep support for leading dot: https://github.com/jshttp/cookie/issues/173
	 *
	 * > (Note that a leading %x2E ("."), if present, is ignored even though that
	 * character is not permitted, but a trailing %x2E ("."), if present, will
	 * cause the user agent to ignore the attribute.)
	 */
	const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
	/**
	 * RegExp to match path-value in RFC 6265 sec 4.1.1
	 *
	 * path-value        = <any CHAR except CTLs or ";">
	 * CHAR              = %x01-7F
	 *                     ; defined in RFC 5234 appendix B.1
	 */
	const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
	const __toString = Object.prototype.toString;
	const NullObject = /* @__PURE__ */ (() => {
	    const C = function () { };
	    C.prototype = Object.create(null);
	    return C;
	})();
	/**
	 * Parse a cookie header.
	 *
	 * Parse the given cookie header string into an object
	 * The object has the various cookies as keys(names) => values
	 */
	function parse(str, options) {
	    const obj = new NullObject();
	    const len = str.length;
	    // RFC 6265 sec 4.1.1, RFC 2616 2.2 defines a cookie name consists of one char minimum, plus '='.
	    if (len < 2)
	        return obj;
	    const dec = options?.decode || decode;
	    let index = 0;
	    do {
	        const eqIdx = str.indexOf("=", index);
	        if (eqIdx === -1)
	            break; // No more cookie pairs.
	        const colonIdx = str.indexOf(";", index);
	        const endIdx = colonIdx === -1 ? len : colonIdx;
	        if (eqIdx > endIdx) {
	            // backtrack on prior semicolon
	            index = str.lastIndexOf(";", eqIdx - 1) + 1;
	            continue;
	        }
	        const keyStartIdx = startIndex(str, index, eqIdx);
	        const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
	        const key = str.slice(keyStartIdx, keyEndIdx);
	        // only assign once
	        if (obj[key] === undefined) {
	            let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
	            let valEndIdx = endIndex(str, endIdx, valStartIdx);
	            const value = dec(str.slice(valStartIdx, valEndIdx));
	            obj[key] = value;
	        }
	        index = endIdx + 1;
	    } while (index < len);
	    return obj;
	}
	function startIndex(str, index, max) {
	    do {
	        const code = str.charCodeAt(index);
	        if (code !== 0x20 /*   */ && code !== 0x09 /* \t */)
	            return index;
	    } while (++index < max);
	    return max;
	}
	function endIndex(str, index, min) {
	    while (index > min) {
	        const code = str.charCodeAt(--index);
	        if (code !== 0x20 /*   */ && code !== 0x09 /* \t */)
	            return index + 1;
	    }
	    return min;
	}
	/**
	 * Serialize data into a cookie header.
	 *
	 * Serialize a name value pair into a cookie string suitable for
	 * http headers. An optional options object specifies cookie parameters.
	 *
	 * serialize('foo', 'bar', { httpOnly: true })
	 *   => "foo=bar; httpOnly"
	 */
	function serialize(name, val, options) {
	    const enc = options?.encode || encodeURIComponent;
	    if (!cookieNameRegExp.test(name)) {
	        throw new TypeError(`argument name is invalid: ${name}`);
	    }
	    const value = enc(val);
	    if (!cookieValueRegExp.test(value)) {
	        throw new TypeError(`argument val is invalid: ${val}`);
	    }
	    let str = name + "=" + value;
	    if (!options)
	        return str;
	    if (options.maxAge !== undefined) {
	        if (!Number.isInteger(options.maxAge)) {
	            throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
	        }
	        str += "; Max-Age=" + options.maxAge;
	    }
	    if (options.domain) {
	        if (!domainValueRegExp.test(options.domain)) {
	            throw new TypeError(`option domain is invalid: ${options.domain}`);
	        }
	        str += "; Domain=" + options.domain;
	    }
	    if (options.path) {
	        if (!pathValueRegExp.test(options.path)) {
	            throw new TypeError(`option path is invalid: ${options.path}`);
	        }
	        str += "; Path=" + options.path;
	    }
	    if (options.expires) {
	        if (!isDate(options.expires) ||
	            !Number.isFinite(options.expires.valueOf())) {
	            throw new TypeError(`option expires is invalid: ${options.expires}`);
	        }
	        str += "; Expires=" + options.expires.toUTCString();
	    }
	    if (options.httpOnly) {
	        str += "; HttpOnly";
	    }
	    if (options.secure) {
	        str += "; Secure";
	    }
	    if (options.partitioned) {
	        str += "; Partitioned";
	    }
	    if (options.priority) {
	        const priority = typeof options.priority === "string"
	            ? options.priority.toLowerCase()
	            : undefined;
	        switch (priority) {
	            case "low":
	                str += "; Priority=Low";
	                break;
	            case "medium":
	                str += "; Priority=Medium";
	                break;
	            case "high":
	                str += "; Priority=High";
	                break;
	            default:
	                throw new TypeError(`option priority is invalid: ${options.priority}`);
	        }
	    }
	    if (options.sameSite) {
	        const sameSite = typeof options.sameSite === "string"
	            ? options.sameSite.toLowerCase()
	            : options.sameSite;
	        switch (sameSite) {
	            case true:
	            case "strict":
	                str += "; SameSite=Strict";
	                break;
	            case "lax":
	                str += "; SameSite=Lax";
	                break;
	            case "none":
	                str += "; SameSite=None";
	                break;
	            default:
	                throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
	        }
	    }
	    return str;
	}
	/**
	 * URL-decode string value. Optimized to skip native call when no %.
	 */
	function decode(str) {
	    if (str.indexOf("%") === -1)
	        return str;
	    try {
	        return decodeURIComponent(str);
	    }
	    catch (e) {
	        return str;
	    }
	}
	/**
	 * Determine if value is a Date.
	 */
	function isDate(val) {
	    return __toString.call(val) === "[object Date]";
	}
	
	return dist;
}

requireDist();

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

/* es-module-lexer 1.7.0 */
var ImportType;!function(A){A[A.Static=1]="Static",A[A.Dynamic=2]="Dynamic",A[A.ImportMeta=3]="ImportMeta",A[A.StaticSourcePhase=4]="StaticSourcePhase",A[A.DynamicSourcePhase=5]="DynamicSourcePhase",A[A.StaticDeferPhase=6]="StaticDeferPhase",A[A.DynamicDeferPhase=7]="DynamicDeferPhase";}(ImportType||(ImportType={}));1===new Uint8Array(new Uint16Array([1]).buffer)[0];const E=()=>{return A="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GzYCHAtBAEEAKAKwCkECajYCsAoCQAJAAkACQEEAECkiAUHhAEYNACABQfcARg0BQQAoArAKIQEMAgtBACgCsAoiAUECakHACEEKEC8NAUEGIQIMAgtBACgCsAoiAS8BAkHpAEcNACABLwEEQfQARw0AQQQhAiABLwEGQegARg0BC0EAIAFBfmo2ArAKDwtBACABIAJBAXRqNgKwCgJAQQEQKUH7AEYNAEEAIAE2ArAKDwtBACgCsAoiACECA0BBACACQQJqNgKwCgJAAkACQEEBECkiAkEiRg0AIAJBJ0cNAUEnEBpBAEEAKAKwCkECajYCsApBARApIQIMAgtBIhAaQQBBACgCsApBAmo2ArAKQQEQKSECDAELIAIQLCECCwJAIAJBOkYNAEEAIAE2ArAKDwtBAEEAKAKwCkECajYCsAoCQEEBECkiAkEiRg0AIAJBJ0YNAEEAIAE2ArAKDwsgAhAaQQBBACgCsApBAmo2ArAKAkACQEEBECkiAkEsRg0AIAJB/QBGDQFBACABNgKwCg8LQQBBACgCsApBAmo2ArAKQQEQKUH9AEYNAEEAKAKwCiECDAELC0EAKALwCSIBIAA2AhAgAUEAKAKwCkECajYCDAttAQJ/AkACQANAAkAgAEH//wNxIgFBd2oiAkEXSw0AQQEgAnRBn4CABHENAgsgAUGgAUYNASAAIQIgARAoDQJBACECQQBBACgCsAoiAEECajYCsAogAC8BAiIADQAMAgsLIAAhAgsgAkH//wNxC6sBAQR/AkACQEEAKAKwCiICLwEAIgNB4QBGDQAgASEEIAAhBQwBC0EAIAJBBGo2ArAKQQEQKSECQQAoArAKIQUCQAJAIAJBIkYNACACQSdGDQAgAhAsGkEAKAKwCiEEDAELIAIQGkEAQQAoArAKQQJqIgQ2ArAKC0EBECkhA0EAKAKwCiECCwJAIAIgBUYNACAFIARBACAAIAAgAUYiAhtBACABIAIbEAILIAMLcgEEf0EAKAKwCiEAQQAoArQKIQECQAJAA0AgAEECaiECIAAgAU8NAQJAAkAgAi8BACIDQaR/ag4CAQQACyACIQAgA0F2ag4EAgEBAgELIABBBGohAAwACwtBACACNgKwChAlQQAPC0EAIAI2ArAKQd0AC0kBA39BACEDAkAgAkUNAAJAA0AgAC0AACIEIAEtAAAiBUcNASABQQFqIQEgAEEBaiEAIAJBf2oiAg0ADAILCyAEIAVrIQMLIAMLC+wBAgBBgAgLzgEAAHgAcABvAHIAdABtAHAAbwByAHQAZgBvAHIAZQB0AGEAbwB1AHIAYwBlAHIAbwBtAHUAbgBjAHQAaQBvAG4AcwBzAGUAcgB0AHYAbwB5AGkAZQBkAGUAbABlAGMAbwBuAHQAaQBuAGkAbgBzAHQAYQBuAHQAeQBiAHIAZQBhAHIAZQB0AHUAcgBkAGUAYgB1AGcAZwBlAGEAdwBhAGkAdABoAHIAdwBoAGkAbABlAGkAZgBjAGEAdABjAGYAaQBuAGEAbABsAGUAbABzAABB0AkLEAEAAAACAAAAAAQAAEA5AAA=","undefined"!=typeof Buffer?Buffer.from(A,"base64"):Uint8Array.from(atob(A),(A=>A.charCodeAt(0)));var A;};WebAssembly.compile(E()).then(WebAssembly.instantiate).then((({exports:A})=>{}));

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/project/safte/","cacheDir":"file:///C:/project/safte/node_modules/.astro/","outDir":"file:///C:/project/safte/dist/","srcDir":"file:///C:/project/safte/src/","publicDir":"file:///C:/project/safte/public/","buildClientDir":"file:///C:/project/safte/dist/","buildServerDir":"file:///C:/project/safte/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"always"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}},{"file":"archive/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/archive","isIndex":false,"type":"page","pattern":"^\\/archive\\/$","segments":[[{"content":"archive","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/archive.astro","pathname":"/archive","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}},{"file":"robots.txt","links":[],"scripts":[],"styles":[],"routeData":{"route":"/robots.txt","isIndex":false,"type":"endpoint","pattern":"^\\/robots\\.txt\\/?$","segments":[[{"content":"robots.txt","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/robots.txt.ts","pathname":"/robots.txt","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}},{"file":"rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.ts","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"always"}}}],"site":"https://fuwari.vercel.app/","base":"/","trailingSlash":"always","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/content/config.ts",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/components/misc/ImageWrapper.astro",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/components/PostCard.astro",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/components/PostPage.astro",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/pages/[...page].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/components/widget/Profile.astro",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/components/widget/SideBar.astro",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/layouts/MainGridLayout.astro",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/pages/about.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/about@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/pages/archive.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/archive@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/pages/posts/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/posts/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/utils/content-utils.ts",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/components/widget/Categories.astro",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/components/widget/Tags.astro",{"propagation":"in-tree","containsHead":false}],["C:/project/safte/src/pages/rss.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@ts",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/archive@_@astro":"pages/archive.astro.mjs","\u0000@astro-page:src/pages/posts/[...slug]@_@astro":"pages/posts/_---slug_.astro.mjs","\u0000@astro-page:src/pages/robots.txt@_@ts":"pages/robots.txt.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@ts":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/[...page]@_@astro":"pages/_---page_.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astro-renderers":"renderers.mjs","C:/project/safte/src/plugins/remark-reading-time.mjs":"chunks/remark-reading-time_Curle1zU.mjs","C:\\project\\safte\\.astro\\content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","C:\\project\\safte\\.astro\\content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","C:/project/safte/src/assets/images/demo-avatar.png":"chunks/demo-avatar_BKG6vI3h.mjs","C:/project/safte/src/assets/images/demo-banner.png":"chunks/demo-banner_C4uCbWNZ.mjs","C:/project/safte/src/components/GlobalStyles.astro":"chunks/GlobalStyles_DTGvhBDb.mjs","C:/project/safte/src/components/LightDarkSwitch.svelte":"_astro/LightDarkSwitch.DhEoypCc.js","C:/project/safte/src/components/Search.svelte":"_astro/Search.P8fat_H_.js","C:/project/safte/src/components/misc/Markdown.astro":"chunks/Markdown_BrAsTmo8.mjs","C:/project/safte/src/components/misc/License.astro":"chunks/License_BOJqOsgC.mjs","C:/project/safte/src/components/PostMeta.astro":"chunks/PostMeta_DIWUY1uR.mjs","C:/project/safte/src/utils/date-utils.ts":"chunks/date-utils_OyTxlY41.mjs","C:/project/safte/src/components/PostPage.astro":"chunks/PostPage_CBh1pMYV.mjs","C:/project/safte/src/components/control/Pagination.astro":"chunks/Pagination_D5We7Rc5.mjs","C:/project/safte/src/components/PostCard.astro":"chunks/PostCard_By6vDvX4.mjs","C:/project/safte/src/components/widget/DisplaySettings.svelte":"_astro/DisplaySettings.CAySDu0Q.js","C:/project/safte/src/utils/setting-utils.ts":"chunks/setting-utils_DALmPtEZ.mjs","C:/project/safte/src/content/config.ts":"chunks/config_fpPIUTnN.mjs","C:/project/safte/src/content/posts/first.md":"chunks/first_BbBbfWQJ.mjs","C:/project/safte/src/content/posts/guide/cover.jpeg":"chunks/cover_CFfeaj9r.mjs","C:/project/safte/src/content/posts/guide/index.md":"chunks/index_CfCuApYR.mjs","C:/project/safte/src/content/spec/about.md":"chunks/about_tbRT3mt4.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_Ca4Mq7A_.mjs","C:/project/safte/node_modules/.pnpm/astro@5.9.2_@netlify+blobs@8.2.0_@types+node@24.0.1_jiti@1.21.7_lightningcss@1.29.3_rollup@2._lv3qh4d2tm42sjdjkskkxkmw2e/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DiZnmn0i.mjs","C:/project/safte/src/components/ArchivePanel.svelte":"chunks/ArchivePanel_BMbMlbz_.mjs","C:/project/safte/node_modules/.pnpm/unstorage@1.16.0_@netlify+blobs@8.2.0/node_modules/unstorage/drivers/fs-lite.mjs":"chunks/fs-lite_COtHaKzy.mjs","\u0000@astrojs-manifest":"manifest_0oGMkZII.mjs","@components/ArchivePanel.svelte":"_astro/ArchivePanel.D7EOKTVh.js","C:/project/safte/src/components/misc/Markdown.astro?astro&type=script&index=0&lang.ts":"_astro/Markdown.astro_astro_type_script_index_0_lang.rK-xmpPD.js","C:/project/safte/src/components/widget/TOC.astro?astro&type=script&index=0&lang.ts":"_astro/TOC.astro_astro_type_script_index_0_lang.DDOZ1KDD.js","C:/project/safte/src/components/Navbar.astro?astro&type=script&index=0&lang.ts":"_astro/Navbar.astro_astro_type_script_index_0_lang.Crn57otv.js","C:/project/safte/src/components/widget/WidgetLayout.astro?astro&type=script&index=0&lang.ts":"_astro/WidgetLayout.astro_astro_type_script_index_0_lang.CJHtMuY3.js","C:/project/safte/node_modules/.pnpm/photoswipe@5.4.4/node_modules/photoswipe/dist/photoswipe.esm.js":"_astro/photoswipe.esm.CKV1Bsxh.js","C:/project/safte/node_modules/.pnpm/@swup+astro@1.6.0_@types+babel__core@7.20.5/node_modules/@swup/astro/dist/client/SwupPreloadPlugin.js":"_astro/SwupPreloadPlugin.CiOSXfDa.js","C:/project/safte/node_modules/.pnpm/@swup+astro@1.6.0_@types+babel__core@7.20.5/node_modules/@swup/astro/dist/client/SwupHeadPlugin.js":"_astro/SwupHeadPlugin.d6nb3Z__.js","C:/project/safte/node_modules/.pnpm/@swup+astro@1.6.0_@types+babel__core@7.20.5/node_modules/@swup/astro/dist/client/SwupScriptsPlugin.js":"_astro/SwupScriptsPlugin.CRD5-C2F.js","@astrojs/svelte/client.js":"_astro/client.svelte.BeY8PDJn.js","C:/project/safte/node_modules/.pnpm/@swup+astro@1.6.0_@types+babel__core@7.20.5/node_modules/@swup/astro/dist/client/SwupA11yPlugin.js":"_astro/SwupA11yPlugin.M_Jz3F07.js","C:/project/safte/node_modules/.pnpm/@swup+astro@1.6.0_@types+babel__core@7.20.5/node_modules/@swup/astro/dist/client/SwupScrollPlugin.js":"_astro/SwupScrollPlugin.BxAIvrH7.js","C:/project/safte/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.DAHrxWCB.js","C:/project/safte/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts":"_astro/Layout.astro_astro_type_script_index_1_lang.D61px8dS.js","astro:scripts/page.js":"_astro/page.D6-Kvdo4.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/project/safte/src/components/misc/Markdown.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"click\",function(s){const t=s.target;if(t&&t.classList.contains(\"copy-btn\")){const c=t.closest(\"pre\")?.querySelector(\"code\"),i=Array.from(c?.querySelectorAll(\".code:not(summary *)\")??[]).map(e=>e.textContent).map(e=>e===`\n`?\"\":e).join(`\n`);navigator.clipboard.writeText(i);const o=t.getAttribute(\"data-timeout-id\");o&&clearTimeout(parseInt(o)),t.classList.add(\"success\");const n=setTimeout(()=>{t.classList.remove(\"success\")},1e3);t.setAttribute(\"data-timeout-id\",n.toString())}});"],["C:/project/safte/src/components/widget/TOC.astro?astro&type=script&index=0&lang.ts","class l extends HTMLElement{tocEl=null;visibleClass=\"visible\";observer;anchorNavTarget=null;headingIdxMap=new Map;headings=[];sections=[];tocEntries=[];active=[];activeIndicator=null;constructor(){super(),this.observer=new IntersectionObserver(this.markVisibleSection,{threshold:0})}markVisibleSection=t=>{t.forEach(e=>{const i=e.target.children[0]?.getAttribute(\"id\"),s=i?this.headingIdxMap.get(i):void 0;s!=null&&(this.active[s]=e.isIntersecting),e.isIntersecting&&this.anchorNavTarget==e.target.firstChild&&(this.anchorNavTarget=null)}),this.active.includes(!0)||this.fallback(),this.update()};toggleActiveHeading=()=>{let t=this.active.length-1,e=this.active.length-1,i=0;for(;t>=0&&!this.active[t];)this.tocEntries[t].classList.remove(this.visibleClass),t--;for(;t>=0&&this.active[t];)this.tocEntries[t].classList.add(this.visibleClass),e=Math.min(e,t),i=Math.max(i,t),t--;for(;t>=0;)this.tocEntries[t].classList.remove(this.visibleClass),t--;let s=this.tocEl?.getBoundingClientRect().top||0,n=this.tocEl?.scrollTop||0,o=this.tocEntries[e].getBoundingClientRect().top-s+n,c=this.tocEntries[i].getBoundingClientRect().bottom-s+n;this.activeIndicator?.setAttribute(\"style\",`top: ${o}px; height: ${c-o}px`)};scrollToActiveHeading=()=>{if(this.anchorNavTarget||!this.tocEl)return;const t=document.querySelectorAll(`#toc .${this.visibleClass}`);if(!t.length)return;const e=t[0],i=t[t.length-1],s=this.tocEl.clientHeight;let n;i.getBoundingClientRect().bottom-e.getBoundingClientRect().top<.9*s?n=e.offsetTop-32:n=i.offsetTop-s*.8,this.tocEl.scrollTo({top:n,left:0,behavior:\"smooth\"})};update=()=>{requestAnimationFrame(()=>{this.toggleActiveHeading(),this.scrollToActiveHeading()})};fallback=()=>{if(this.sections.length)for(let t=0;t<this.sections.length;t++){let e=this.sections[t].getBoundingClientRect().top,i=this.sections[t].getBoundingClientRect().bottom;if(this.isInRange(e,0,window.innerHeight)||this.isInRange(i,0,window.innerHeight)||e<0&&i>window.innerHeight)this.markActiveHeading(t);else if(e>window.innerHeight)break}};markActiveHeading=t=>{this.active[t]=!0};handleAnchorClick=t=>{const e=t.composedPath().find(i=>i instanceof HTMLAnchorElement);if(e){const i=decodeURIComponent(e.hash?.substring(1)),s=this.headingIdxMap.get(i);s!==void 0?this.anchorNavTarget=this.headings[s]:this.anchorNavTarget=null}};isInRange(t,e,i){return e<t&&t<i}connectedCallback(){const t=document.querySelector(\".prose\");t?t.addEventListener(\"animationend\",()=>{this.init()},{once:!0}):console.debug(\"Animation element not found\")}init(){if(this.tocEl=document.getElementById(\"toc-inner-wrapper\"),!!this.tocEl&&(this.tocEl.addEventListener(\"click\",this.handleAnchorClick,{capture:!0}),this.activeIndicator=document.getElementById(\"active-indicator\"),this.tocEntries=Array.from(document.querySelectorAll(\"#toc a[href^='#']\")),this.tocEntries.length!==0)){this.sections=new Array(this.tocEntries.length),this.headings=new Array(this.tocEntries.length);for(let t=0;t<this.tocEntries.length;t++){const e=decodeURIComponent(this.tocEntries[t].hash?.substring(1)),i=document.getElementById(e),s=i?.parentElement;i instanceof HTMLElement&&s instanceof HTMLElement&&(this.headings[t]=i,this.sections[t]=s,this.headingIdxMap.set(e,t))}this.active=new Array(this.tocEntries.length).fill(!1),this.sections.forEach(t=>this.observer.observe(t)),this.fallback(),this.update()}}disconnectedCallback(){this.sections.forEach(t=>this.observer.unobserve(t)),this.observer.disconnect(),this.tocEl?.removeEventListener(\"click\",this.handleAnchorClick)}}customElements.get(\"table-of-contents\")||customElements.define(\"table-of-contents\",l);"],["C:/project/safte/src/components/Navbar.astro?astro&type=script&index=0&lang.ts","function c(){localStorage.theme===\"dark\"?(document.documentElement.classList.remove(\"dark\"),localStorage.theme=\"light\"):(document.documentElement.classList.add(\"dark\"),localStorage.theme=\"dark\")}function o(){let t=document.getElementById(\"scheme-switch\");t&&(t.onclick=function(){c()});let n=document.getElementById(\"display-settings-switch\");n&&(n.onclick=function(){let e=document.getElementById(\"display-setting\");e&&e.classList.toggle(\"float-panel-closed\")});let l=document.getElementById(\"nav-menu-switch\");l&&(l.onclick=function(){let e=document.getElementById(\"nav-menu-panel\");e&&e.classList.toggle(\"float-panel-closed\")})}o();"],["C:/project/safte/src/components/widget/WidgetLayout.astro?astro&type=script&index=0&lang.ts","class d extends HTMLElement{constructor(){if(super(),this.dataset.isCollapsed!==\"true\")return;const e=this.dataset.id,t=this.querySelector(\".expand-btn\"),s=this.querySelector(`#${e}`);t.addEventListener(\"click\",()=>{s.classList.remove(\"collapsed\"),t.classList.add(\"hidden\")})}}customElements.get(\"widget-layout\")||customElements.define(\"widget-layout\",d);"]],"assets":["/_astro/ec.d1dr8.css","/_astro/ec.qopfj.js","/_astro/jetbrains-mono-cyrillic-wght-normal.D73BlboJ.woff2","/_astro/jetbrains-mono-vietnamese-wght-normal.Bt-aOZkq.woff2","/_astro/jetbrains-mono-greek-wght-normal.Bw9x6K1M.woff2","/_astro/jetbrains-mono-latin-ext-wght-normal.DBQx-q_a.woff2","/_astro/jetbrains-mono-latin-wght-normal.B9CIFXIH.woff2","/_astro/jetbrains-mono-greek-wght-italic.Dmq-fBVQ.woff2","/_astro/jetbrains-mono-cyrillic-wght-italic.CfQkWpeR.woff2","/_astro/jetbrains-mono-vietnamese-wght-italic.Dcombn6O.woff2","/_astro/jetbrains-mono-latin-ext-wght-italic.BrDczivE.woff2","/_astro/jetbrains-mono-latin-wght-italic.B2M6KQje.woff2","/_astro/demo-avatar.CxcI0ivM.png","/_astro/demo-banner.WD4SMgz_.png","/_astro/cover.CgGywNHJ.jpeg","/_astro/roboto-math-400-normal.B3wgz80t.woff2","/_astro/roboto-cyrillic-ext-400-normal.DzMWdK87.woff2","/_astro/roboto-cyrillic-400-normal.DAIM1_dR.woff2","/_astro/roboto-greek-400-normal.jFM2czAU.woff2","/_astro/roboto-latin-ext-400-normal.ZYmyxeOy.woff2","/_astro/roboto-vietnamese-400-normal.CDDxGrUb.woff2","/_astro/roboto-symbols-400-normal.fF1SLJBj.woff2","/_astro/roboto-latin-400-normal.CNwBRw8h.woff2","/_astro/roboto-cyrillic-500-normal.hCeO1jFL.woff2","/_astro/roboto-cyrillic-ext-500-normal.B7rQpwPu.woff2","/_astro/roboto-math-500-normal.CFNaIMFC.woff2","/_astro/roboto-greek-500-normal.BJMS0heP.woff2","/_astro/roboto-vietnamese-500-normal.HYpufUYk.woff2","/_astro/roboto-latin-ext-500-normal.C_ARlJGk.woff2","/_astro/roboto-symbols-500-normal.BXFTxrNR.woff2","/_astro/roboto-latin-500-normal.CkrA1NAy.woff2","/_astro/roboto-greek-700-normal.DpKAje7q.woff2","/_astro/roboto-cyrillic-ext-700-normal.D_fA0fHY.woff2","/_astro/roboto-math-700-normal.xbpggnJp.woff2","/_astro/roboto-cyrillic-700-normal.CzEIZVQR.woff2","/_astro/roboto-symbols-700-normal.DKkQdRpM.woff2","/_astro/roboto-vietnamese-700-normal.BFWtvCOj.woff2","/_astro/roboto-latin-ext-700-normal.BNPgmEQS.woff2","/_astro/roboto-latin-700-normal.DZr4b_KL.woff2","/_astro/KaTeX_AMS-Regular.BQhdFMY1.woff2","/_astro/KaTeX_Caligraphic-Bold.Dq_IR9rO.woff2","/_astro/KaTeX_Fraktur-Bold.CL6g_b3V.woff2","/_astro/KaTeX_Caligraphic-Regular.Di6jR-x-.woff2","/_astro/KaTeX_Main-Bold.Cx986IdX.woff2","/_astro/KaTeX_Main-Italic.NWA7e6Wa.woff2","/_astro/KaTeX_Main-BoldItalic.DxDJ3AOS.woff2","/_astro/KaTeX_Math-BoldItalic.CZnvNsCZ.woff2","/_astro/KaTeX_Math-Italic.t53AETM-.woff2","/_astro/KaTeX_Main-Regular.B22Nviop.woff2","/_astro/KaTeX_Fraktur-Regular.CTYiF6lA.woff2","/_astro/KaTeX_SansSerif-Bold.D1sUS0GD.woff2","/_astro/KaTeX_Size1-Regular.mCD8mA8B.woff2","/_astro/KaTeX_Script-Regular.D3wIWfF6.woff2","/_astro/KaTeX_Size2-Regular.Dy4dx90m.woff2","/_astro/KaTeX_SansSerif-Regular.DDBCnlJ7.woff2","/_astro/KaTeX_Size4-Regular.Dl5lxZxV.woff2","/_astro/KaTeX_Typewriter-Regular.CO6r4hn1.woff2","/_astro/KaTeX_SansSerif-Italic.C3H0VqGB.woff2","/_astro/roboto-math-400-normal.BRMeFL5Z.woff","/_astro/roboto-cyrillic-ext-400-normal.5IDvadIC.woff","/_astro/roboto-cyrillic-400-normal.C5q4FMUG.woff","/_astro/roboto-greek-400-normal.DwVopRQH.woff","/_astro/roboto-symbols-400-normal.B2LMqLB2.woff","/_astro/roboto-vietnamese-400-normal.BYP5tVVv.woff","/_astro/roboto-latin-ext-400-normal.BG57dRWO.woff","/_astro/roboto-latin-400-normal.BX2H0A0_.woff","/_astro/roboto-cyrillic-ext-500-normal.aAFKCR76.woff","/_astro/roboto-cyrillic-500-normal.DhPqGoNQ.woff","/_astro/roboto-math-500-normal.nGmytUgK.woff","/_astro/roboto-vietnamese-500-normal.CUzdRVXb.woff","/_astro/roboto-greek-500-normal.B0wzjI_J.woff","/_astro/roboto-symbols-500-normal.B3xPS0M7.woff","/_astro/roboto-latin-ext-500-normal.EUd9mLnZ.woff","/_astro/roboto-latin-500-normal.CoDN7ZW2.woff","/_astro/roboto-greek-700-normal.DXrPs8of.woff","/_astro/roboto-cyrillic-ext-700-normal.y_8Eg3F3.woff","/_astro/roboto-symbols-700-normal.D_8z4JZ9.woff","/_astro/roboto-math-700-normal.yuY-ZMbs.woff","/_astro/roboto-vietnamese-700-normal.7YosmkaU.woff","/_astro/roboto-latin-ext-700-normal.DGcaX69F.woff","/_astro/roboto-cyrillic-700-normal.BmXeMSnZ.woff","/_astro/KaTeX_AMS-Regular.DMm9YOAa.woff","/_astro/roboto-latin-700-normal.D74k8Kh_.woff","/_astro/KaTeX_Fraktur-Bold.BsDP51OF.woff","/_astro/KaTeX_Caligraphic-Bold.BEiXGLvX.woff","/_astro/KaTeX_Caligraphic-Regular.CTRA-rTL.woff","/_astro/KaTeX_Main-Bold.Jm3AIy58.woff","/_astro/KaTeX_Main-Italic.BMLOBm91.woff","/_astro/KaTeX_Main-BoldItalic.SpSLRI95.woff","/_astro/KaTeX_Math-Italic.DA0__PXp.woff","/_astro/KaTeX_Math-BoldItalic.iY-2wyZ7.woff","/_astro/KaTeX_Main-Regular.Dr94JaBh.woff","/_astro/KaTeX_SansSerif-Bold.DbIhKOiC.woff","/_astro/KaTeX_Fraktur-Regular.Dxdc4cR9.woff","/_astro/KaTeX_Size1-Regular.C195tn64.woff","/_astro/KaTeX_Size2-Regular.oD1tc_U0.woff","/_astro/KaTeX_Script-Regular.D5yQViql.woff","/_astro/KaTeX_SansSerif-Regular.CS6fqUqJ.woff","/_astro/KaTeX_Size3-Regular.CTq5MqoE.woff","/_astro/KaTeX_Size4-Regular.BF-4gkZK.woff","/_astro/KaTeX_SansSerif-Italic.DN2j7dab.woff","/_astro/KaTeX_Typewriter-Regular.C0xS9mPB.woff","/_astro/KaTeX_Caligraphic-Regular.wX97UBjC.ttf","/_astro/KaTeX_Fraktur-Bold.BdnERNNW.ttf","/_astro/KaTeX_Caligraphic-Bold.ATXxdsX0.ttf","/_astro/KaTeX_AMS-Regular.DRggAlZN.ttf","/_astro/KaTeX_Main-Bold.waoOVXN0.ttf","/_astro/KaTeX_Main-BoldItalic.DzxPMmG6.ttf","/_astro/KaTeX_Main-Italic.3WenGoN9.ttf","/_astro/KaTeX_Math-BoldItalic.B3XSjfu4.ttf","/_astro/KaTeX_SansSerif-Bold.CFMepnvq.ttf","/_astro/KaTeX_Fraktur-Regular.CB_wures.ttf","/_astro/KaTeX_Math-Italic.flOr_0UB.ttf","/_astro/KaTeX_Main-Regular.ypZvNtVU.ttf","/_astro/KaTeX_Size2-Regular.B7gKUWhC.ttf","/_astro/KaTeX_Size1-Regular.Dbsnue_I.ttf","/_astro/KaTeX_Script-Regular.C5JkGWo-.ttf","/_astro/KaTeX_SansSerif-Regular.BNo7hRIc.ttf","/_astro/KaTeX_Size3-Regular.DgpXs0kz.ttf","/_astro/KaTeX_SansSerif-Italic.YYjJ1zSn.ttf","/_astro/KaTeX_Typewriter-Regular.D3Ib7_Hf.ttf","/_astro/KaTeX_Size4-Regular.DWFBv043.ttf","/_astro/_page_.CO27kg37.css","/_astro/_page_.DsP0njBR.css","/_astro/about.BtniRLn_.css","/favicon/favicon-dark-128.png","/favicon/favicon-dark-180.png","/favicon/favicon-dark-192.png","/favicon/favicon-dark-32.png","/favicon/favicon-light-128.png","/favicon/favicon-light-180.png","/favicon/favicon-light-192.png","/favicon/favicon-light-32.png","/_astro/ArchivePanel.D7EOKTVh.js","/_astro/client.svelte.BeY8PDJn.js","/_astro/DisplaySettings.CAySDu0Q.js","/_astro/each.twdX4J9P.js","/_astro/Icon.UEWU6AJy.js","/_astro/index.modern.BC8Oj8jT.js","/_astro/input.jHPnfo7T.js","/_astro/Layout.astro_astro_type_script_index_0_lang.DAHrxWCB.js","/_astro/Layout.astro_astro_type_script_index_1_lang.D61px8dS.js","/_astro/Layout.CFwGdNXj.css","/_astro/Layout.DSulWsr7.css","/_astro/LightDarkSwitch.DhEoypCc.js","/_astro/page.D6-Kvdo4.js","/_astro/photoswipe.esm.CKV1Bsxh.js","/_astro/preload-helper.BlTxHScW.js","/_astro/render._D_RCwKb.js","/_astro/Search.P8fat_H_.js","/_astro/setting-utils.BxLMWhr6.js","/_astro/Swup.CFWAd-Wq.js","/_astro/SwupA11yPlugin.M_Jz3F07.js","/_astro/SwupHeadPlugin.d6nb3Z__.js","/_astro/SwupPreloadPlugin.CiOSXfDa.js","/_astro/SwupScriptsPlugin.CRD5-C2F.js","/_astro/SwupScrollPlugin.BxAIvrH7.js","/_astro/translation.Dn8TC-pC.js","/_astro/url-utils.BVq8MMCj.js","/_astro/zh_TW.aT3F8SJu.js","/_astro/page.D6-Kvdo4.js","/about/index.html","/archive/index.html","/robots.txt","/rss.xml"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"TzxMP0eEPvT4SrwHiYx7S6uRcus0LaJhYr4jf2iXErA=","sessionConfig":{"driver":"fs-lite","options":{"base":"C:\\project\\safte\\node_modules\\.astro\\sessions"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/fs-lite_COtHaKzy.mjs');

export { manifest };
