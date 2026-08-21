import React from 'react';

export const PatchNotesView: React.FC<{
  patchNotes: any[];
}> = ({ patchNotes }) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">패치 노트</h2>
          <p className="text-sm sm:text-base text-slate-400">시스템 업데이트 및 기능 개선 내역</p>
        </div>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
        {patchNotes.length === 0 ? (
          <div className="text-center py-20 text-slate-500 relative z-10 bg-[#0B0F19]">
            아직 등록된 패치 노트가 없습니다.
          </div>
        ) : (
          patchNotes.map((note) => (
            <div key={note.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0B0F19] bg-purple-500 text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                </svg>
              </div>

              <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl group-hover:border-purple-500/50 transition-all ml-4 md:ml-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <span className="text-purple-400 font-bold text-xs sm:text-sm bg-purple-500/10 px-3 py-1 rounded-full w-fit">{note.version}</span>
                  <time className="text-xs sm:text-sm font-medium text-slate-500">{new Date(note.createdAt).toLocaleDateString('ko-KR')}</time>
                </div>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {note.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
