import React from 'react';
import { Composition } from 'remotion';
import { DashboardShowcase } from './compositions/DashboardShowcase';
import { LeadDatabaseShowcase } from './compositions/LeadDatabaseShowcase';
import { PipelineShowcase } from './compositions/PipelineShowcase';
import { IntentScoreReveal } from './compositions/IntentScoreReveal';
import { PipelineFlow } from './compositions/PipelineFlow';
import { SequencerTimeline } from './compositions/SequencerTimeline';
import { CampaignStats } from './compositions/CampaignStats';
import { KeywordMonitor } from './compositions/KeywordMonitor';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Social 1080x1080 compositions ── */}
      <Composition id="DashboardShowcase" component={DashboardShowcase} durationInFrames={270} fps={30} width={1080} height={1080} />
      <Composition id="IntentScoreReveal" component={IntentScoreReveal} durationInFrames={240} fps={30} width={1080} height={1080} />
      <Composition id="PipelineFlow"      component={PipelineFlow}      durationInFrames={240} fps={30} width={1080} height={1080} />
      <Composition id="SequencerTimeline" component={SequencerTimeline} durationInFrames={240} fps={30} width={1080} height={1080} />
      <Composition id="CampaignStats"     component={CampaignStats}     durationInFrames={240} fps={30} width={1080} height={1080} />
      <Composition id="KeywordMonitor"    component={KeywordMonitor}    durationInFrames={240} fps={30} width={1080} height={1080} />
      {/* ── Existing showcase compositions ── */}
      <Composition id="LeadDatabaseShowcase" component={LeadDatabaseShowcase} durationInFrames={210} fps={30} width={1080} height={1080} />
      <Composition id="PipelineShowcase"     component={PipelineShowcase}     durationInFrames={270} fps={30} width={1920} height={1080} />
    </>
  );
};
