import React from 'react';
import { Composition } from 'remotion';
import { DashboardShowcase } from './compositions/DashboardShowcase';
import { LeadDatabaseShowcase } from './compositions/LeadDatabaseShowcase';
import { PipelineShowcase } from './compositions/PipelineShowcase';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="DashboardShowcase" component={DashboardShowcase} durationInFrames={240} fps={30} width={1920} height={1080} />
      <Composition id="LeadDatabaseShowcase" component={LeadDatabaseShowcase} durationInFrames={210} fps={30} width={1080} height={1080} />
      <Composition id="PipelineShowcase" component={PipelineShowcase} durationInFrames={270} fps={30} width={1920} height={1080} />
    </>
  );
};
