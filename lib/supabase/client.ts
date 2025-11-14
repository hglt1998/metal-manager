
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () =>
	createBrowserClient(supabaseUrl!, supabaseKey!, {
		cookies: {
			getAll() {
				// En el servidor, devolver array vacío ya que el proxy maneja las cookies
				if (typeof document === "undefined") {
					return [];
				}
				// Filtrar cookies vacías y parsear correctamente
				const cookies = document.cookie.split("; ").filter(Boolean);
				return cookies.map((cookie) => {
					const equalsIndex = cookie.indexOf("=");
					if (equalsIndex === -1) {
						return { name: cookie, value: "" };
					}
					const name = cookie.substring(0, equalsIndex);
					const value = cookie.substring(equalsIndex + 1);
					return { name, value };
				});
			},
			setAll(cookies) {
				// En el servidor, no hacer nada ya que el proxy maneja las cookies
				if (typeof document === "undefined") {
					return;
				}
				cookies.forEach(({ name, value, options }) => {
					const cookieString = `${name}=${value}`;
					const maxAge = options?.maxAge ? `; max-age=${options.maxAge}` : "";
					const path = options?.path || "/";
					const domain = options?.domain ? `; domain=${options.domain}` : "";
					const sameSite = options?.sameSite ? `; samesite=${options.sameSite}` : "; samesite=lax";
					// En Safari móvil, es importante incluir Secure para cookies sensibles
					const secure = options?.secure !== false ? "; secure" : "";
					document.cookie = `${cookieString}; path=${path}${maxAge}${domain}${sameSite}${secure}`;
				});
			}
		}
	});
