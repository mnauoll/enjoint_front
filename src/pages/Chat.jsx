import { useEffect, useRef, useState } from 'react';
import AppHeader from '../components/AppHeader';
import { ImagePlus, Send, X } from 'lucide-react';

const initialConversations = [
  {
    id: 'central-park', kind: 'group', title: 'Central Park morning walk', initials: 'JL',
    subtitle: '9 participants, including you · Hosted by Jamie Lee',
    preview: 'Looking forward to it!', previewTime: '10:45 AM',
    eventDate: 'Saturday at 10 AM', eventPlace: 'Bethesda Fountain, Central Park',
    notice: 'You joined this event and were added to its group chat · Oct 24, 10:00–11:30 AM',
    messages: [
      { id: 'c1', author: 'Jamie Lee · Host', text: "Hi everyone! We'll meet at Bethesda Fountain on Saturday at 10 AM. Bring water and comfortable shoes.", time: '10:32 AM' },
      { id: 'c2', author: 'Sam Kim', text: "Is this beginner-friendly? I'm looking forward to meeting everyone.", time: '10:35 AM' },
      { id: 'c3', author: 'Jamie Lee · Host', text: "Absolutely! We'll keep a relaxed pace and stop for a chat by the lake.", time: '10:37 AM' },
      { id: 'c4', author: 'Alex Morgan · You', text: 'Sounds great. See you by the fountain!', time: '10:42 AM', own: true, status: 'Sent' },
      { id: 'c5', author: 'Sam Kim', text: 'Perfect, looking forward to it!', time: '10:45 AM' },
    ],
  },
  {
    id: 'coffee', kind: 'group', title: 'Coffee & conversations', initials: 'CP',
    subtitle: '6 participants · Hosted by Casey Park',
    preview: 'See you soon!', previewTime: 'Yesterday',
    eventDate: 'Sunday at 11 AM', eventPlace: 'Devoción, Williamsburg',
    notice: 'You joined this event and were added to its group chat · Oct 25, 11:00 AM',
    messages: [
      { id: 'cc1', author: 'Casey Park · Host', text: 'Hey everyone! I booked a table for Sunday. Come by whenever you can.', time: 'Yesterday' },
      { id: 'cc2', author: 'Alex Morgan · You', text: 'See you soon! Looking forward to meeting everyone.', time: 'Yesterday', own: true, status: 'Sent' },
    ],
  },
  {
    id: 'jamie', kind: 'private', title: 'Jamie Lee', initials: 'JL', subtitle: 'Online',
    preview: 'That sounds like a plan!', previewTime: '9:18 AM',
    messages: [
      { id: 'j1', author: 'Jamie Lee', text: 'Thanks for joining the walk! Have you been to Central Park before?', time: '9:12 AM' },
      { id: 'j2', author: 'Alex Morgan · You', text: "A few times, but it's always nice to explore a new part of it.", time: '9:15 AM', own: true, status: 'Sent' },
      { id: 'j3', author: 'Jamie Lee', text: 'That sounds like a plan!', time: '9:18 AM' },
    ],
  },
  {
    id: 'sam', kind: 'private', title: 'Sam Kim', initials: 'SK', subtitle: 'Last seen today',
    preview: 'See you at the fountain.', previewTime: 'Yesterday',
    messages: [
      { id: 's1', author: 'Alex Morgan · You', text: 'Hey Sam, are you joining the walk this weekend?', time: 'Yesterday', own: true, status: 'Sent' },
      { id: 's2', author: 'Sam Kim', text: 'Yes! See you at the fountain.', time: 'Yesterday' },
    ],
  },
];

const STORAGE_KEY = 'enjoint-chat-conversations';

function loadConversations(chatRequest) {
  let conversations = initialConversations;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) conversations = initialConversations;
    else {
    const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.every((item) => item && typeof item.id === 'string' && Array.isArray(item.messages))) {
        conversations = parsed;
      } else {
        console.error('Saved chat data is invalid; loading sample conversations instead.');
      }
    }
  } catch (error) {
    console.error('Unable to load saved chat conversations:', error);
  }

  if (!chatRequest) return conversations;
  const existing = conversations.find(({ id }) => id === chatRequest.id);
  if (!existing) return [{ ...chatRequest, messages: chatRequest.messages || [] }, ...conversations];

  return conversations.map((conversation) =>
    conversation.id === chatRequest.id
      ? {
          ...chatRequest,
          ...existing,
          title: chatRequest.title,
          initials: chatRequest.initials,
          subtitle: chatRequest.subtitle,
          eventDate: chatRequest.eventDate,
          eventPlace: chatRequest.eventPlace,
          notice: chatRequest.notice,
        }
      : conversation,
  );
}

function currentTime() {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date());
}

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getInitialTheme() {
  try {
    return window.localStorage.getItem('theme') !== 'light';
  } catch (error) {
    console.error('Unable to load saved theme:', error);
    return true;
  }
}

export default function Chat({
  isDark: propIsDark,
  setIsDark: propSetIsDark,
  onTabChange,
  chatRequest,
  onChatRequestHandled,
}) {
  const [conversations, setConversations] = useState(() => loadConversations(chatRequest));
  const [kind, setKind] = useState(chatRequest?.kind || 'group');
  const [selectedId, setSelectedId] = useState(chatRequest?.id || 'central-park');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [localIsDark, setLocalIsDark] = useState(getInitialTheme);
  const isDark = propIsDark ?? localIsDark;
  const [eventOpen, setEventOpen] = useState(false);
  const messageListRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Unable to save chat conversations:', error);
    }
  }, [conversations]);

  useEffect(() => {
    if (chatRequest) onChatRequestHandled?.();
  }, [chatRequest, onChatRequestHandled]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Unable to save selected theme:', error);
    }
  }, [isDark]);

  const visibleConversations = conversations
    .filter((conversation) => conversation.kind === kind)
    .filter((conversation) => {
      const query = search.trim().toLowerCase();
      return !query || [
        conversation.title, conversation.subtitle, conversation.preview,
        ...conversation.messages.map((message) => message.text),
      ].join(' ').toLowerCase().includes(query);
    })
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  const selected = visibleConversations.find((conversation) => conversation.id === selectedId)
    || visibleConversations[0]
    || null;

  useEffect(() => {
    if (messageListRef.current) messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [selectedId, selected?.messages.length]);

  const appendMessage = (message) => {
    if (!selected) return;
    const now = Date.now();
    const time = currentTime();
    const nextMessage = {
      id: `${selected.id}-${now}-${Math.random().toString(36).slice(2, 8)}`,
      author: 'Alex Morgan · You', time, own: true, status: 'Sent', ...message,
    };
    setConversations((items) => items.map((item) => item.id === selected.id
      ? { ...item, preview: nextMessage.text || nextMessage.fileName, previewTime: time, updatedAt: now, messages: [...item.messages, nextMessage] }
      : item));
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !selected) return;
    appendMessage({ text });
    setDraft('');
  };

  const attachFile = (event) => {
    const file = event.target.files?.[0];
    if (!file || !selected) return;
    appendMessage({
      text: `Shared a file: ${file.name}`,
      fileName: file.name,
      fileType: file.type || 'File',
      fileSize: formatFileSize(file.size),
    });
    event.target.value = '';
  };

  const chooseKind = (nextKind) => {
    setKind(nextKind);
    setSelectedId(conversations.find((conversation) => conversation.kind === nextKind)?.id || '');
    setSearch('');
  };

  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#F7F8FA] font-rubik text-[#262626] transition-colors dark:bg-[#1A212B] dark:text-white">
      <AppHeader
        activeTab="Chat"
        onTabChange={onTabChange}
        isDark={isDark}
        onToggleTheme={() => {
          if (propSetIsDark) propSetIsDark((current) => !current);
          else setLocalIsDark((current) => !current);
        }}
        action="theme"
      />

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[24%] min-w-[220px] max-w-[340px] shrink-0 flex-col border-r border-gray-200 bg-white p-[17px_19px_20px] transition-colors dark:border-[#252C35] dark:bg-[#11161D] max-[760px]:w-[34%] max-[760px]:min-w-[185px] max-[760px]:px-[10px] max-[520px]:w-[112px] max-[520px]:min-w-[112px] max-[520px]:px-[7px] max-[520px]:py-[13px]">
          <h1 className="mb-[15px] text-base font-semibold max-[520px]:mb-3 max-[520px]:pl-[3px] max-[520px]:text-sm">Chats</h1>
          <div className="mb-[15px] flex gap-[7px] max-[520px]:mb-3 max-[520px]:flex-col max-[520px]:gap-[5px]" role="tablist" aria-label="Chat type">
            <button
              type="button"
              role="tab"
              aria-selected={kind === 'private'}
              onClick={() => chooseKind('private')}
              className={`inline-flex h-[26px] cursor-pointer items-center gap-1 rounded-full border px-[10px] text-[10px] max-[520px]:justify-center max-[520px]:px-[6px] ${
                kind === 'private'
                  ? 'border-[#E65A9C] bg-[#FCE8F2] text-[#AD316B] dark:bg-[#2E2030] dark:text-[#FF87C2]'
                  : 'border-gray-300 bg-transparent text-[#262626] dark:border-[#343C47] dark:text-white'
              }`}
            >
              Private
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={kind === 'group'}
              onClick={() => chooseKind('group')}
              className={`inline-flex h-[26px] cursor-pointer items-center gap-1 rounded-full border px-[10px] text-[10px] max-[520px]:justify-center max-[520px]:px-[6px] ${
                kind === 'group'
                  ? 'border-[#E65A9C] bg-[#FCE8F2] text-[#AD316B] dark:bg-[#2E2030] dark:text-[#FF87C2]'
                  : 'border-gray-300 bg-transparent text-[#262626] dark:border-[#343C47] dark:text-white'
              }`}
            >
              <span aria-hidden="true">✓</span> Groups
            </button>
          </div>
          <label className="mb-1.5 text-[10px] text-gray-500 dark:text-[#9BA3B0] max-[520px]:hidden" htmlFor="conversation-search">
            Search conversations
          </label>
          <div className="mb-[13px] flex h-8 items-center rounded-[18px] border border-gray-200 bg-gray-100 px-[10px] transition-colors dark:border-[#252D37] dark:bg-[#1B222C] max-[520px]:mb-[9px] max-[520px]:h-[29px] max-[520px]:px-[7px]">
            <input
              id="conversation-search"
              type="search"
              placeholder="Search by name or event"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full min-w-0 bg-transparent text-[10px] text-[#262626] outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-[#F1F1F4] max-[520px]:text-[9px]"
            />
            {search && (
              <button type="button" aria-label="Clear search" onClick={() => setSearch('')} className="grid cursor-pointer place-items-center text-gray-500 dark:text-[#9BA3B0]">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="grid content-start gap-[7px] overflow-auto">
            {visibleConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setSelectedId(conversation.id)}
                className={`flex min-w-0 cursor-pointer items-center gap-[9px] rounded-[13px] p-[9px] text-left transition-colors max-[520px]:flex-col max-[520px]:items-start max-[520px]:gap-[5px] max-[520px]:px-[6px] max-[520px]:py-2 ${
                  selected?.id === conversation.id
                    ? 'bg-[#F9E8F0] dark:bg-[#382334]'
                    : 'hover:bg-gray-100 dark:hover:bg-[#1A2029]'
                }`}
              >
                <span className="grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full bg-[#F3E4EC] text-[9px] text-[#AD316B] dark:bg-[#382334] dark:text-white">
                  {conversation.initials}
                </span>
                <span className="grid min-w-0 gap-[3px] max-[520px]:w-full">
                  <span className="overflow-hidden text-ellipsis text-[10px] font-medium whitespace-nowrap max-[520px]:text-[9px] max-[520px]:whitespace-normal">
                    {conversation.title}
                  </span>
                  <span className="overflow-hidden text-ellipsis text-[9px] whitespace-nowrap text-gray-500 dark:text-[#AFB5C0] max-[520px]:text-[8px]">
                    {conversation.preview}
                  </span>
                  <span className="overflow-hidden text-ellipsis text-[8px] whitespace-nowrap text-gray-400 dark:text-[#8F97A3]">
                    {conversation.previewTime}
                  </span>
                </span>
              </button>
            ))}
            {visibleConversations.length === 0 && (
              <p className="px-1 py-2 text-[11px] text-gray-500 dark:text-[#9BA3B0]">No conversations found.</p>
            )}
          </div>
          <p className="mt-[13px] text-[9px] leading-relaxed text-gray-500 dark:text-[#9BA3B0] max-[520px]:text-[8px]">
            {kind === 'group' ? 'Event chats are available when you join an event.' : 'Your private conversations appear here.'}
          </p>
        </aside>

        <section className="relative flex min-w-0 flex-1 flex-col bg-[#F0F2F5] transition-colors dark:bg-[#1A212B]" aria-label="Conversation">
          {selected && selected.kind === kind ? (
            <>
              <div className="flex h-[63px] shrink-0 items-center gap-[10px] bg-white px-[18px] transition-colors dark:bg-[#11161D] max-[520px]:h-[61px] max-[520px]:gap-[7px] max-[520px]:px-[10px]">
                <span className="grid h-[29px] w-[29px] shrink-0 place-items-center rounded-full bg-[#F3E4EC] text-[9px] text-[#AD316B] dark:bg-[#382334] dark:text-white">{selected.initials}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="mb-1 overflow-hidden text-ellipsis text-[11px] font-medium whitespace-nowrap">{selected.title}</h2>
                  <p className="overflow-hidden text-ellipsis text-[9px] whitespace-nowrap text-gray-500 dark:text-[#A7AFBB]">{selected.subtitle}</p>
                </div>
                {selected.kind === 'group' && (
                  <button
                    type="button"
                    onClick={() => setEventOpen(true)}
                    className="cursor-pointer rounded-full border border-gray-300 bg-transparent px-[18px] py-2 text-[9px] hover:border-[#FF7FC0] hover:text-[#AD316B] dark:border-[#29313B] dark:hover:text-[#FF9CCC] max-[520px]:px-[9px] max-[520px]:py-[7px] max-[520px]:text-[8px]"
                  >
                    View event
                  </button>
                )}
              </div>
              {selected.notice && (
                <div className="flex h-8 shrink-0 items-center overflow-hidden border-t border-gray-200 bg-gray-100 px-[18px] text-[9px] text-gray-500 dark:border-[#1B222B] dark:bg-[#1B222B] dark:text-[#AEB5C0] max-[520px]:h-[30px] max-[520px]:px-[10px] max-[520px]:text-[8px]">
                  ✓ {selected.notice}
                </div>
              )}
              <div ref={messageListRef} aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-[18px] [scrollbar-color:#9ca3af_transparent] [scrollbar-width:thin] dark:[scrollbar-color:#39414d_transparent] max-[760px]:px-[10px] max-[760px]:py-[14px]">
                <p className="mb-px text-[9px] text-gray-500 dark:text-[#AAB1BC]">
                  {selected.kind === 'group' ? 'Monday, October 19, 2026' : 'Today'}
                </p>
                {selected.messages.map((message) => (
                  <article
                    key={message.id}
                    className={`w-[min(390px,72%)] rounded-[16px_16px_16px_3px] border p-[10px_11px_9px] max-[1200px]:w-[min(390px,72%)] max-[520px]:w-[92%] max-[520px]:p-[9px] ${
                      message.own
                        ? 'self-end rounded-[16px_16px_3px_16px] border-[#E8C8D9] bg-[#F9E8F0] dark:border-[#4A2A42] dark:bg-[#382334]'
                        : 'border-gray-200 bg-white dark:border-[#28303B] dark:bg-[#11161D]'
                    }`}
                  >
                    <span className="mb-1.5 block text-[9px] font-medium text-[#AD316B] dark:text-[#FF78B9]">{message.author}</span>
                    <p className="m-0 text-[10px] leading-[1.5] text-[#262626] [overflow-wrap:anywhere] dark:text-[#F5F5F7] max-[520px]:text-[9px]">{message.text}</p>
                    {message.fileName && (
                      <div className="mt-[9px] flex items-center gap-2 rounded-[9px] border border-gray-200 p-2 text-[#AD316B] dark:border-white/10 dark:text-[#FF9ACB]">
                        <ImagePlus size={17} aria-hidden="true" />
                        <span className="grid min-w-0 gap-[3px]">
                          <strong className="overflow-hidden text-ellipsis text-[9px] whitespace-nowrap text-[#262626] dark:text-[#F5F5F7]">{message.fileName}</strong>
                          <small className="text-[8px] text-gray-500 dark:text-[#B7ADBA]">{message.fileType} · {message.fileSize}</small>
                        </span>
                      </div>
                    )}
                    <span className="mt-1.5 block text-[8px] text-gray-500 dark:text-[#9DA5B1]">
                      {message.time}{message.own && message.status ? ` · ${message.status}` : ''}
                    </span>
                  </article>
                ))}
              </div>
              <form onSubmit={sendMessage} className="flex shrink-0 items-center gap-[10px] px-[18px] pt-3 pb-4 max-[760px]:gap-[7px] max-[760px]:px-[10px]">
                <div className="flex h-9 min-w-0 flex-1 items-center rounded-[22px] border border-gray-200 bg-white px-[11px] transition-colors dark:border-[#29313B] dark:bg-[#11161D]">
                  <input
                    type="text"
                    aria-label="Type your message"
                    placeholder="Type your message..."
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    className="w-full min-w-0 bg-transparent text-[10px] text-[#262626] outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-[#AEB5C0]"
                  />
                  <input ref={fileInputRef} className="hidden" type="file" onChange={attachFile} aria-label="Attach a file" />
                  <button type="button" aria-label="Attach a file" onClick={() => fileInputRef.current?.click()} className="grid h-[25px] w-[25px] shrink-0 cursor-pointer place-items-center text-[#AD316B] dark:text-[#FF77B8]">
                    <ImagePlus size={17} />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="flex h-[31px] min-w-[72px] cursor-pointer items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#F16DB4] to-[#FF813E] px-[15px] text-[10px] font-semibold text-[#171219] disabled:cursor-default disabled:opacity-80 max-[520px]:h-9 max-[520px]:w-[38px] max-[520px]:min-w-[38px] max-[520px]:p-0"
                >
                  <span className="max-[520px]:hidden">Send</span><Send size={15} className="hidden max-[520px]:block" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-[9px] text-center text-gray-500 dark:text-[#9BA3B0]">
              <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-[#F3E4EC] text-xs text-[#AD316B] dark:bg-[#382334] dark:text-white">EN</span>
              <h2 className="m-0 text-sm text-[#262626] dark:text-[#F5F5F7]">No conversations yet</h2>
              <p className="m-0 text-[11px]">{search ? 'Try another search.' : 'Choose another chat type to see your conversations.'}</p>
            </div>
          )}
        </section>
      </div>

      {eventOpen && selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-5"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setEventOpen(false); }}
        >
          <section className="relative w-full max-w-[380px] rounded-2xl border border-gray-200 bg-white p-[25px] shadow-2xl dark:border-[#34303A] dark:bg-[#151A22]" role="dialog" aria-modal="true" aria-labelledby="chat-event-title">
            <button type="button" aria-label="Close event details" onClick={() => setEventOpen(false)} className="absolute top-[13px] right-[13px] grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-gray-100 dark:bg-[#252B34]">
              <X size={18} />
            </button>
            <span className="text-[9px] tracking-[1px] text-[#AD316B] dark:text-[#FF7FC0]">GROUP EVENT</span>
            <h2 id="chat-event-title" className="mt-3 mb-[15px] mr-[30px] text-[17px]">{selected.title}</h2>
            <p className="my-2 text-[11px] text-gray-600 dark:text-[#C1C6CE]">{selected.eventDate}</p>
            <p className="my-2 text-[11px] text-gray-600 dark:text-[#C1C6CE]">{selected.eventPlace}</p>
            <p className="my-2 text-[11px] text-gray-600 dark:text-[#C1C6CE]">{selected.subtitle}</p>
          </section>
        </div>
      )}
    </main>
  );
}