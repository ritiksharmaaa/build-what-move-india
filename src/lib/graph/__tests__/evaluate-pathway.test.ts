import { describe, it, expect } from 'vitest';
import { evaluateGraph } from '../evaluate-pathway';
import { computeStatistics } from '../compute-statistics';
import { computeCascade } from '../compute-cascade';
import type { StudentDecisionInput } from '../../contracts/student';

describe('Graph Engine', () => {
  const mockNodes = [
    {
      id: 'sci_bsc_physics',
      nameEn: 'BSc Physics',
      nameHi: 'बीएससी भौतिकी',
      family: 'science',
      tier: 'now',
      costRangeMinINR: 5000,
      costRangeMaxINR: 150000,
      costType: 'both',
      durationMonths: 36,
      competitiveness: 'high_intake'
    },
    {
      id: 'sci_btech_cs',
      nameEn: 'B.Tech Computer Science',
      nameHi: 'बी.टेक कंप्यूटर साइंस',
      family: 'science',
      tier: 'now',
      costRangeMinINR: 100000,
      costRangeMaxINR: 500000,
      costType: 'both',
      durationMonths: 48,
      competitiveness: 'highly_competitive'
    }
  ];

  const mockEdges = [
    {
      id: 'edge_1',
      fromNodeId: 'start',
      toNodeId: 'sci_bsc_physics',
      requiredStage: 'class_12',
      requiredStream: 'science',
      requiresMaths: false,
      edgeType: 'direct'
    },
    {
      id: 'edge_2',
      fromNodeId: 'start',
      toNodeId: 'sci_btech_cs',
      requiredStage: 'class_12',
      requiredStream: 'science',
      requiresMaths: true,
      edgeType: 'direct'
    }
  ];

  const mockSources: any[] = [];

  it('should open physics and close B.Tech for science without maths', () => {
    const input: StudentDecisionInput = {
      stage: 'class_12',
      class12Stream: 'science_without_maths',
      stateCode: 'UP',
      interests: ['Science'],
      goals: ['Scientist'],
      budgetBand: 'medium',
      earningUrgency: 'long_term',
      preferredLanguage: 'en'
    };

    const results = evaluateGraph(input, mockNodes, mockEdges, mockSources);
    
    const physicsNode = results.find(n => n.nodeId === 'sci_bsc_physics');
    const btechNode = results.find(n => n.nodeId === 'sci_btech_cs');

    expect(physicsNode?.doorStatus).toBe('open');
    expect(btechNode?.doorStatus).toBe('closed');
    expect(btechNode?.doorReasonEn).toBe('Requires Mathematics.');
  });

  it('should open both for science with maths', () => {
    const input: StudentDecisionInput = {
      stage: 'class_12',
      class12Stream: 'science_with_maths',
      stateCode: 'UP',
      interests: ['Science', 'Computers'],
      goals: ['Engineer'],
      budgetBand: 'high',
      earningUrgency: 'long_term',
      preferredLanguage: 'en'
    };

    const results = evaluateGraph(input, mockNodes, mockEdges, mockSources);
    
    const physicsNode = results.find(n => n.nodeId === 'sci_bsc_physics');
    const btechNode = results.find(n => n.nodeId === 'sci_btech_cs');

    expect(physicsNode?.doorStatus).toBe('open');
    expect(btechNode?.doorStatus).toBe('open');
  });

  it('should compute valid statistics', () => {
    const input: StudentDecisionInput = {
      stage: 'class_12',
      class12Stream: 'science_without_maths',
      stateCode: 'UP',
      interests: [],
      goals: [],
      budgetBand: 'medium',
      earningUrgency: 'long_term',
      preferredLanguage: 'en'
    };
    const results = evaluateGraph(input, mockNodes, mockEdges, mockSources);
    const stats = computeStatistics(results);
    
    expect(stats.totalPaths).toBe(2);
    expect(stats.openPaths).toBe(1);
    expect(stats.closedPaths).toBe(1);
  });

  it('should compute valid cascades', () => {
    const inputWithMaths: StudentDecisionInput = {
      stage: 'class_12',
      class12Stream: 'science_with_maths',
      stateCode: 'UP',
      interests: [],
      goals: [],
      budgetBand: 'high',
      earningUrgency: 'long_term',
      preferredLanguage: 'en'
    };
    const inputWithoutMaths: StudentDecisionInput = {
      ...inputWithMaths,
      class12Stream: 'science_without_maths'
    };

    const before = evaluateGraph(inputWithMaths, mockNodes, mockEdges, mockSources);
    const after = evaluateGraph(inputWithoutMaths, mockNodes, mockEdges, mockSources);

    const cascade = computeCascade('maths', before, after, 'en');

    expect(cascade.doorsClosed.length).toBe(1);
    expect(cascade.doorsClosed[0].nodeId).toBe('sci_btech_cs');
    expect(cascade.doorsOpened.length).toBe(0);
    expect(cascade.doorsUnchanged).toBe(1);
  });
});
