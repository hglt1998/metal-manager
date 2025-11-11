
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
				return document.cookie.split("; ").filter(Boolean).map((cookie) => {
					const [name, ...rest] = cookie.split("=");
					return { name, value: rest.join("=") };
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
					const secure = options?.secure ? "; secure" : "";
					document.cookie = `${cookieString}; path=${path}${maxAge}${domain}${sameSite}${secure}`;
				});
			}
		}
	});
