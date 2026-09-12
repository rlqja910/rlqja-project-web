import React from 'react';
import * as LucideIcons from 'lucide-react';

export const PatchNotesView: React.FC<{
  patchNotes: any[];
}> = ({ patchNotes }) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-[3px] border-[#2d1b54] gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#2d1b54] brutal-border-accent flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <LucideIcons.Wrench className="w-6 h-6 text-cyan-400 pixel-icon" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-pixel pokemon-title drop-shadow-[2px_2px_0_#7c3aed] mb-1 sm:mb-2">패치 노트</h2>
            <p className="text-sm sm:text-base text-gray-300 font-pixel bg-[#1a103c] py-1 px-3 inline-block brutal-border">시스템 업데이트 및 기능 개선 내역</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[3px] before:bg-gradient-to-b before:from-[#0f0c29] before:via-[#7c3aed] before:to-[#0f0c29]">
        {patchNotes.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-pixel relative z-10 bg-[#0f0c29]">
            아직 등록된 패치 노트가 없습니다.
          </div>
        ) : (
          patchNotes.map((note) => (
            <div key={note.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 brutal-border bg-[#0f0c29] text-cyan-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                <LucideIcons.CheckCircle2 className="w-5 h-5 pixel-icon" />
              </div>

              <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] p-5 sm:p-6 bg-[#1a103c] brutal-border brutal-shadow group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.6)] transition-all ml-4 md:ml-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 border-b-[3px] border-[#2d1b54] pb-3">
                  <span className="text-cyan-400 font-pixel text-xs sm:text-sm bg-[#0f0c29] px-3 py-1 brutal-border-accent w-fit">{note.version}</span>
                  <time className="text-xs sm:text-sm font-pixel text-gray-400">{new Date(note.createdAt).toLocaleDateString('ko-KR')}</time>
                </div>
                <div className="text-gray-200 text-sm font-pixel leading-relaxed whitespace-pre-line drop-shadow-[1px_1px_0_#000]">
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
