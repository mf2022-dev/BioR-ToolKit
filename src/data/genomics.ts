// =============================================================================
// BioR Platform - Genomics Data Module
// =============================================================================

import type { GenomicSample, PipelineStage, AMRHeatmap } from '../types';

export const genomicSamples: GenomicSample[] = [
  { sampleId: 'BioR-2026-SA-0847', pathogen: 'SARS-CoV-2', lineage: 'BA.2.86.4', platform: 'Illumina MiSeq', pipelineStatus: 'Completed', coverage: 125, amrDetected: false, amrGenes: [], quality: 'good', institution: 'King Faisal Specialist Hospital', date: '2026-03-07', readLength: '2x150bp', totalReads: '2.4M', assemblyLength: '29,903 bp', mutations: 42, novelMutations: 3 },
  { sampleId: 'BioR-2026-SA-0846', pathogen: 'Vibrio cholerae O1', lineage: 'O1 El Tor', platform: 'Illumina NovaSeq', pipelineStatus: 'Completed', coverage: 89, amrDetected: true, amrGenes: ['blaCTX-M-15', 'tetA'], quality: 'good', institution: 'Riyadh Central Lab', date: '2026-03-07', readLength: '2x250bp', totalReads: '5.1M', assemblyLength: '4.03 Mbp', mutations: 18, novelMutations: 0 },
  { sampleId: 'BioR-2026-SA-0845', pathogen: 'MERS-CoV', lineage: 'Clade B', platform: 'Oxford Nanopore', pipelineStatus: 'Completed', coverage: 156, amrDetected: false, amrGenes: [], quality: 'good', institution: 'King Fahad Medical City', date: '2026-03-06', readLength: 'Long-read', totalReads: '1.8M', assemblyLength: '30,119 bp', mutations: 8, novelMutations: 1 },
  { sampleId: 'BioR-2026-SA-0844', pathogen: 'Klebsiella pneumoniae', lineage: 'ST258', platform: 'Illumina MiSeq', pipelineStatus: 'Completed', coverage: 95, amrDetected: true, amrGenes: ['blaKPC-3', 'blaNDM-1', 'mcr-1'], quality: 'good', institution: 'Dammam Central Lab', date: '2026-03-06', readLength: '2x300bp', totalReads: '3.2M', assemblyLength: '5.67 Mbp', mutations: 0, novelMutations: 0 },
  { sampleId: 'BioR-2026-SA-0843', pathogen: 'Salmonella enterica', lineage: 'ST313', platform: 'Illumina NovaSeq', pipelineStatus: 'Completed', coverage: 112, amrDetected: true, amrGenes: ['blaCMY-2', 'qnrS1'], quality: 'good', institution: 'Jeddah Reference Lab', date: '2026-03-06', readLength: '2x150bp', totalReads: '4.5M', assemblyLength: '4.87 Mbp', mutations: 12, novelMutations: 0 },
  { sampleId: 'BioR-2026-SA-0842', pathogen: 'Mycobacterium tuberculosis', lineage: 'Lineage 4.3.3', platform: 'Illumina MiSeq', pipelineStatus: 'Processing', coverage: 78, amrDetected: true, amrGenes: ['rpoB-S450L', 'katG-S315T'], quality: 'acceptable', institution: 'King Fahad Medical City', date: '2026-03-05', readLength: '2x300bp', totalReads: '2.1M', assemblyLength: 'In progress', mutations: 0, novelMutations: 0 },
  { sampleId: 'BioR-2026-SA-0841', pathogen: 'SARS-CoV-2', lineage: 'JN.1.18.1', platform: 'Oxford Nanopore', pipelineStatus: 'Processing', coverage: 67, amrDetected: false, amrGenes: [], quality: 'acceptable', institution: 'Madinah Regional Lab', date: '2026-03-05', readLength: 'Long-read', totalReads: '1.2M', assemblyLength: 'In progress', mutations: 0, novelMutations: 0 },
  { sampleId: 'BioR-2026-SA-0840', pathogen: 'CCHF Virus', lineage: 'Asia-1', platform: 'Illumina MiSeq', pipelineStatus: 'Completed', coverage: 145, amrDetected: false, amrGenes: [], quality: 'good', institution: 'Tabuk Military Hospital', date: '2026-03-05', readLength: '2x150bp', totalReads: '3.8M', assemblyLength: '19,217 bp', mutations: 5, novelMutations: 2 },
  { sampleId: 'BioR-2026-SA-0839', pathogen: 'Dengue Virus', lineage: 'DENV-2 Cosmopolitan', platform: 'Illumina MiSeq', pipelineStatus: 'Completed', coverage: 98, amrDetected: false, amrGenes: [], quality: 'good', institution: 'Jizan Health Center', date: '2026-03-04', readLength: '2x150bp', totalReads: '2.8M', assemblyLength: '10,723 bp', mutations: 14, novelMutations: 0 },
  { sampleId: 'BioR-2026-SA-0838', pathogen: 'Vibrio cholerae O1', lineage: 'O1 El Tor', platform: 'Illumina NovaSeq', pipelineStatus: 'Failed', coverage: 12, amrDetected: false, amrGenes: [], quality: 'failed', institution: 'Qassim Central Lab', date: '2026-03-04', readLength: '2x250bp', totalReads: '0.3M', assemblyLength: 'N/A', mutations: 0, novelMutations: 0 },
  { sampleId: 'BioR-2026-SA-0837', pathogen: 'Influenza A', lineage: 'H3N2 3C.2a1b.2a.2', platform: 'Illumina MiSeq', pipelineStatus: 'Completed', coverage: 88, amrDetected: false, amrGenes: [], quality: 'good', institution: 'Riyadh Airport Lab', date: '2026-03-04', readLength: '2x150bp', totalReads: '2.0M', assemblyLength: '13,588 bp', mutations: 22, novelMutations: 1 },
  { sampleId: 'BioR-2026-SA-0836', pathogen: 'E. coli (ESBL)', lineage: 'ST131', platform: 'Illumina MiSeq', pipelineStatus: 'Completed', coverage: 110, amrDetected: true, amrGenes: ['blaCTX-M-27', 'aac(6)-Ib-cr'], quality: 'good', institution: 'King Faisal Specialist Hospital', date: '2026-03-03', readLength: '2x300bp', totalReads: '3.5M', assemblyLength: '5.23 Mbp', mutations: 0, novelMutations: 0 },
  { sampleId: 'BioR-2026-SA-0835', pathogen: 'MERS-CoV', lineage: 'Clade B', platform: 'Oxford Nanopore', pipelineStatus: 'Processing', coverage: 45, amrDetected: false, amrGenes: [], quality: 'acceptable', institution: 'Eastern Province Lab', date: '2026-03-03', readLength: 'Long-read', totalReads: '0.9M', assemblyLength: 'In progress', mutations: 0, novelMutations: 0 },
  { sampleId: 'BioR-2026-SA-0834', pathogen: 'Acinetobacter baumannii', lineage: 'IC2/ST2', platform: 'Illumina NovaSeq', pipelineStatus: 'Completed', coverage: 134, amrDetected: true, amrGenes: ['blaOXA-23', 'armA', 'blaNDM-1'], quality: 'good', institution: 'Riyadh Central Lab', date: '2026-03-03', readLength: '2x150bp', totalReads: '4.2M', assemblyLength: '3.98 Mbp', mutations: 0, novelMutations: 0 },
  { sampleId: 'BioR-2026-SA-0833', pathogen: 'SARS-CoV-2', lineage: 'BA.2.86.1', platform: 'Illumina MiSeq', pipelineStatus: 'Failed', coverage: 8, amrDetected: false, amrGenes: [], quality: 'failed', institution: 'Hail Regional Lab', date: '2026-03-02', readLength: '2x150bp', totalReads: '0.2M', assemblyLength: 'N/A', mutations: 0, novelMutations: 0 },
]


export const pipelineStages: PipelineStage[] = [
  { name: 'Raw Upload', icon: 'fa-upload', completed: 856, active: 0, failed: 0 },
  { name: 'QC Check', icon: 'fa-check-circle', completed: 842, active: 4, failed: 10 },
  { name: 'Assembly', icon: 'fa-layer-group', completed: 830, active: 8, failed: 4 },
  { name: 'Classification', icon: 'fa-tags', completed: 820, active: 12, failed: 2 },
  { name: 'AMR Scan', icon: 'fa-pills', completed: 815, active: 5, failed: 0 },
  { name: 'Phylogenetics', icon: 'fa-code-branch', completed: 742, active: 73, failed: 0 },
]


export const amrHeatmap: AMRHeatmap = {
  pathogens: ['K. pneumoniae', 'E. coli', 'A. baumannii', 'S. aureus', 'P. aeruginosa', 'Salmonella'],
  antibiotics: ['Carbapenems', 'Cephalosporins', 'Fluoroquinolones', 'Aminoglycosides', 'Colistin', 'Tetracyclines'],
  data: [
    [85, 92, 45, 38, 12, 28],
    [15, 78, 55, 22, 3, 35],
    [88, 95, 72, 65, 8, 42],
    [2, 8, 42, 5, 0, 18],
    [35, 18, 48, 28, 15, 22],
    [5, 45, 32, 12, 2, 62],
  ]
}

