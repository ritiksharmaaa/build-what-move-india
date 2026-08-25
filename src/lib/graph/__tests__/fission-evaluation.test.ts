import { describe, it, expect } from 'vitest';
import { evaluateGraph } from '../evaluate-pathway';
import { computeStatistics } from '../compute-statistics';
import type { StudentDecisionInput } from '../../contracts/student';

describe('Nuclear Fission Evaluation & Constraints Engine', () => {
  const testNodes = [
    {
      id: 'deg_btech_jee',
      nameEn: 'JEE Advanced / IIT B.Tech',
      nameHi: 'आईआईटी बी.टेक',
      family: 'science',
      tier: 'now',
      costRangeMinINR: 50000,
      costRangeMaxINR: 900000,
      costType: 'both',
      durationMonths: 48,
      competitiveness: 'highly_competitive',
    },
    {
      id: 'deg_mbbs_neet',
      nameEn: 'NEET UG / MBBS',
      nameHi: 'नीट यूजी एमबीबीएस',
      family: 'science',
      tier: 'now',
      costRangeMinINR: 15000,
      costRangeMaxINR: 6500000,
      costType: 'both',
      durationMonths: 66,
      competitiveness: 'highly_competitive',
    },
    {
      id: 'deg_cuet_graduation',
      nameEn: 'CUET UG BA/BSc',
      nameHi: 'सीयूईटी स्नातक',
      family: 'humanities',
      tier: 'now',
      costRangeMinINR: 8000,
      costRangeMaxINR: 60000,
      costType: 'government',
      durationMonths: 36,
      competitiveness: 'moderate',
    },
  ];

  const testEdges = [
    {
      id: 'e_jee',
      fromNodeId: 'start',
      toNodeId: 'deg_btech_jee',
      requiredStage: 'class_12',
      requiredStream: 'science',
      requiresMaths: true,
      edgeType: 'direct',
    },
    {
      id: 'e_neet',
      fromNodeId: 'start',
      toNodeId: 'deg_mbbs_neet',
      requiredStage: 'class_12',
      requiredStream: 'science',
      requiresMaths: false,
      edgeType: 'direct',
    },
    {
      id: 'e_cuet',
      fromNodeId: 'start',
      toNodeId: 'deg_cuet_graduation',
      requiredStage: 'class_12',
      requiredStream: 'any',
      requiresMaths: false,
      edgeType: 'direct',
    },
  ];

  it('correctly locks Engineering when Mathematics is absent (PCB stream)', () => {
    const studentPCB: StudentDecisionInput = {
      stage: 'class_12',
      class12Stream: 'science_without_maths',
      stateCode: 'UP',
      interests: ['Medicine'],
      goals: ['Doctor'],
      budgetBand: 'medium',
      earningUrgency: 'long_term',
      preferredLanguage: 'hi',
    };

    const evaluated = evaluateGraph(studentPCB, testNodes, testEdges, []);
    const jeeNode = evaluated.find((n) => n.nodeId === 'deg_btech_jee');
    const neetNode = evaluated.find((n) => n.nodeId === 'deg_mbbs_neet');

    expect(jeeNode?.doorStatus).toBe('closed');
    expect(jeeNode?.doorReasonEn).toContain('Requires Mathematics');
    expect(neetNode?.doorStatus).toBe('open');
  });

  it('correctly unlocks Engineering when Mathematics is present (PCM stream)', () => {
    const studentPCM: StudentDecisionInput = {
      stage: 'class_12',
      class12Stream: 'science_with_maths',
      stateCode: 'UP',
      interests: ['Tech'],
      goals: ['Engineer'],
      budgetBand: 'high',
      earningUrgency: 'long_term',
      preferredLanguage: 'en',
    };

    const evaluated = evaluateGraph(studentPCM, testNodes, testEdges, []);
    const jeeNode = evaluated.find((n) => n.nodeId === 'deg_btech_jee');
    const neetNode = evaluated.find((n) => n.nodeId === 'deg_mbbs_neet');

    expect(jeeNode?.doorStatus).toBe('open');
    expect(neetNode?.doorStatus).toBe('open');
  });

  it('allows open graduation across any stream for CUET/Civil Service base', () => {
    const studentArts: StudentDecisionInput = {
      stage: 'class_12',
      class12Stream: 'humanities',
      stateCode: 'UP',
      interests: ['Public Service'],
      goals: ['IAS'],
      budgetBand: 'low',
      earningUrgency: 'long_term',
      preferredLanguage: 'hi',
    };

    const evaluated = evaluateGraph(studentArts, testNodes, testEdges, []);
    const cuetNode = evaluated.find((n) => n.nodeId === 'deg_cuet_graduation');
    expect(cuetNode?.doorStatus).toBe('open');
  });

  it('computes accurate statistics for active vs locked paths', () => {
    const studentArts: StudentDecisionInput = {
      stage: 'class_12',
      class12Stream: 'humanities',
      stateCode: 'UP',
      interests: [],
      goals: [],
      budgetBand: 'low',
      earningUrgency: 'long_term',
      preferredLanguage: 'en',
    };

    const evaluated = evaluateGraph(studentArts, testNodes, testEdges, []);
    const stats = computeStatistics(evaluated);

    expect(stats.totalPaths).toBe(3);
    expect(stats.closedPaths).toBe(2); // JEE and NEET closed for humanities
    expect(stats.openPaths).toBe(1); // CUET open
  });
});
