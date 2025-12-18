"use client";

import { useState, Fragment } from "react";
import {
  Combobox,
  ComboboxOption,
  ComboboxOptions,
  ComboboxInput,
  Transition,
} from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Loader2, AlertTriangle } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { searchUsers } from "../../features/users/actions";
import { UserSearchResult } from "../../features/users/types/user.types";

type UserFilterProps = {
  selectedUser: UserSearchResult | null;
  onUserSelect: (user: UserSearchResult | null) => void;
};

export function UserFilter({ selectedUser, onUserSelect }: UserFilterProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["users", debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery.length < 2)
        return {
          data: [],
          pagination: {
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      const result = await searchUsers({ query: debouncedQuery, pageSize: 10 });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 30000,
    retry: false,
  });

  const users = data?.data || [];

  const isSearching =
    query.length >= 2 && (query !== debouncedQuery || isFetching) && !isError;

  return (
    <div className="w-full">
      <Combobox value={selectedUser} onChange={onUserSelect}>
        <div className="relative">
          <div className="relative w-full">
            <ComboboxInput
              className="w-full rounded-lg bg-surface-600 border border-border py-3 pl-10 pr-10 text-light placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Search users by name or username..."
              onChange={(event) => setQuery(event.target.value)}
            />

            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-muted" />
            </div>

          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ComboboxOptions className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg bg-surface-700 border border-border py-1 shadow-xl">
              {query.length < 2 ? (
                <div className="px-4 py-3 text-muted text-sm">
                  Type at least 2 characters to search
                </div>
              ) : isSearching ? (
                <div className="px-4 py-3 text-muted text-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </div>
                </div>
              ) : isError ? (
                <div className="px-4 py-3 text-warning text-sm">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error instanceof Error ? error.message : "Failed to search users"}</span>
                  </div>
                </div>
              ) : users.length === 0 ? (
                <div className="px-4 py-3 text-muted text-sm">
                  No users found
                </div>
              ) : (
                <>
                  {users.map((user) => (
                    <ComboboxOption
                      key={user.id}
                      value={user}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-3 px-4 transition-colors ${
                          active ? "bg-surface-600 text-light" : "text-muted"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <span
                              className={`block truncate ${
                                selected ? "font-semibold" : "font-normal"
                              } text-light`}
                            >
                              {user.name}
                            </span>
                            <span className="block text-sm text-muted">
                              @{user.username}
                            </span>
                          </div>
                          <span className="text-xs text-muted bg-surface-800 px-2 py-1 rounded">
                            {user.postsCount}{" "}
                            {user.postsCount === 1 ? "post" : "posts"}
                          </span>
                        </div>
                      )}
                    </ComboboxOption>
                  ))}
                </>
              )}
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>

      {selectedUser && (
        <div className="mt-3 flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-lg px-4 py-2">
          <span className="text-sm text-light">
            Filtering by:{" "}
            <span className="font-semibold">{selectedUser.name}</span>
          </span>
          <button
            onClick={() => {
              onUserSelect(null);
              setQuery("");
            }}
            className="ml-auto text-accent hover:text-accent-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
