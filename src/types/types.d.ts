export interface IResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export interface IPagination {
  page: number
  limit: number
  totalDocs: number
  totalPages: number
}

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user']
  }
}

declare module 'next-auth' {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string
    name: string
    role: string
  }
  // /**
  //  * The shape of the account object returned in the OAuth providers' `account` callback,
  //  * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
  //  */
  // interface Account {}
  // /**
  //  * Returned by `useSession`, `auth`, contains information about the active session.
  //  */
  // interface Session {}
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
  }
}
