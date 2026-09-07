import Fuse from "fuse.js";
import { useEffect, useRef, useState, useMemo, type FormEvent } from "react";
import Card from "@components/Card";
import type { CollectionEntry } from "astro:content";

export type SearchItem = {
  title: string;
  description: string;
  data: CollectionEntry<"blog">["data"];
  slug: string;
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

// CJK 字符只需一个字即可触发搜索；拉丁字母保持至少两个字符
const CJK_PATTERN = /[぀-ヿ㐀-䶿一-鿿豈-﫿]/;
const canSearch = (value: string) =>
  value.length > 1 || (value.length > 0 && CJK_PATTERN.test(value));

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: ["title", "description"],
        includeMatches: true,
        minMatchCharLength: 1,
        threshold: 0.5,
      }),
    [searchList]
  );

  useEffect(() => {
    // if URL has search query,
    // insert that search query in input field
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    // focus the input and put the cursor at the end of the string
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    const timer = setTimeout(() => {
      input.selectionStart = input.selectionEnd = searchStr?.length || 0;
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // CJK 单字即可搜索，其余情况至少两个字符
    const inputResult = canSearch(inputVal) ? fuse.search(inputVal) : [];
    setSearchResults(inputResult);

    // Update search string in URL
    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.replaceState(history.state, "", newRelativePathQuery);
    } else {
      history.replaceState(history.state, "", window.location.pathname);
    }
  }, [inputVal]);

  return (
    <>
      <label className="relative block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-75">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5-2.243 5-5 5z"></path>
          </svg>
          <span className="sr-only">搜索</span>
        </span>
        <input
          className="block w-full rounded border border-skin-fill/40 bg-skin-fill py-3 pl-10 pr-3 placeholder:italic focus:border-skin-accent focus:outline-none"
          placeholder="搜索文章标题或描述…"
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          ref={inputRef}
        />
      </label>

      {canSearch(inputVal) && (
        <div className="mt-8" role="status" aria-live="polite">
          共找到 {searchResults?.length ?? 0} 篇与「{inputVal}」相关的文章
        </div>
      )}

      <ul>
        {searchResults &&
          searchResults.map(({ item, refIndex }) => (
            <Card
              href={`/posts/${item.slug}/`}
              frontmatter={item.data}
              key={`${refIndex}-${item.slug}`}
            />
          ))}
      </ul>
    </>
  );
}
