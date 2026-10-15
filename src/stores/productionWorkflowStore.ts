/**
 * @file productionWorkflowStore.ts
 * Reactive state store for the Designer Production Workflow Module.
 * Tracks the 8 bespoke craftsmanship stages:
 * Pattern Design -> Fabric Selection -> Cutting -> Sewing -> Finishing -> Quality Control -> Packaging -> Shipping.
 */

import { useState, useEffect } from 'react';
import {
  OrderProductionWorkflow,
  ProductionStageName,
  WorkflowStage,
  StageNote,
} from '../types/productionWorkflow.types';

export const STAGE_NAMES_IN_ORDER: ProductionStageName[] = [
  'Pattern Design',
  'Fabric Selection',
  'Cutting',
  'Sewing',
  'Finishing',
  'Quality Control',
  'Packaging',
  'Shipping',
];

const DEFAULT_ARTISAN_ASSIGNMENTS: Record<ProductionStageName, { artisan: string; role: string; hours: number; defaultSummary: string }> = {
  'Pattern Design': {
    artisan: 'Daniel’s Maison',
    role: 'Master Pattern Drafter',
    hours: 16,
    defaultSummary: 'Bespoke paper pattern drafted to client anatomical dimensions with custom balance adjustments.',
  },
  'Fabric Selection': {
    artisan: 'Eleanor Vance',
    role: 'Textile Archivist',
    hours: 8,
    defaultSummary: 'Raw yardage inspected under natural studio light; grain-line inspected and steam-preshrunk.',
  },
  'Cutting': {
    artisan: 'Henry Alcott',
    role: 'Senior Cloth Cutter',
    hours: 12,
    defaultSummary: 'Garment shears applied along pattern lines with bespoke inlay seam allowances.',
  },
  'Sewing': {
    artisan: 'Brigitte Moreau',
    role: 'Couture Tailor',
    hours: 36,
    defaultSummary: 'Floating horsehair chest canvas basted; hand-stitched collar roll and anatomical lapels shaped.',
  },
  'Finishing': {
    artisan: 'Brigitte Moreau',
    role: 'Hand-Finisher',
    hours: 14,
    defaultSummary: 'Buttonholes hand-worked with gimp silk thread; hand-pick lapel stitching and lining anchored.',
  },
  'Quality Control': {
    artisan: 'Master Daniel',
    role: 'Atelier QC Gatekeeper',
    hours: 6,
    defaultSummary: 'Final pressing, millimeter tolerance verification against client measurements sheet.',
  },
  'Packaging': {
    artisan: 'Atelier Packaging Team',
    role: 'Heritage Packager',
    hours: 4,
    defaultSummary: 'Placed in breathable organic cotton garment bag with custom carved cedar hanger and atelier wax seal.',
  },
  'Shipping': {
    artisan: 'Savile Row Logistics',
    role: 'White Glove Dispatcher',
    hours: 2,
    defaultSummary: 'Handed to insured courier service with signed chain-of-custody tracking manifest.',
  },
};

export function createDefaultStagesForGarment(): WorkflowStage[] {
  return STAGE_NAMES_IN_ORDER.map((stageName, index) => {
    const meta = DEFAULT_ARTISAN_ASSIGNMENTS[stageName];
    return {
      id: `stg_${index + 1}_${stageName.toLowerCase().replace(/\s+/g, '_')}`,
      stage: stageName,
      order: index + 1,
      status: 'Not Started',
      progress: 0,
      estimatedDurationHours: meta.hours,
      assignedArtisan: meta.artisan,
      artisanRole: meta.role,
      notes: [],
      customerSummary: meta.defaultSummary,
    };
  });
}

export const INITIAL_PRODUCTION_WORKFLOWS: OrderProductionWorkflow[] = [
  {
    id: 'wf_001_dm_9480',
    orderId: 'ord_dm_9480',
    orderNumber: 'DM-2026-9480',
    customerName: 'Sir Julian Thorne',
    customerEmail: 'thorne@blackwood-capital.com',
    garmentName: 'Anatomical Savile Row Tuxedo Jacket',
    garmentCategory: 'jackets',
    garmentThumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    currentStage: 'Sewing',
    overallProgress: 45,
    startedAt: '2026-10-10T10:00:00Z',
    estimatedFinishAt: '2026-10-24T17:00:00Z',
    isRushOrder: false,
    qualityScore: 99.8,
    customerVisibilityEnabled: true,
    stages: [
      {
        id: 'stg_1_pattern',
        stage: 'Pattern Design',
        order: 1,
        status: 'Completed',
        progress: 100,
        startedAt: '2026-10-10T10:30:00Z',
        completedAt: '2026-10-11T09:00:00Z',
        estimatedDurationHours: 16,
        assignedArtisan: 'Daniel’s Maison',
        artisanRole: 'Master Pattern Drafter',
        customerSummary: 'Bespoke pattern drafted to your exact measurements (108cm chest, 92cm waist) with peak lapel balance.',
        notes: [
          {
            id: 'n_01',
            timestamp: '2026-10-10T12:00:00Z',
            artisanName: 'Daniel’s Maison',
            text: 'Cut individual pattern block on 280gsm manila card. Adjusted roped shoulder crown by 1.2cm.',
            isCustomerVisible: false,
          },
          {
            id: 'n_02',
            timestamp: '2026-10-10T16:30:00Z',
            artisanName: 'Daniel’s Maison',
            text: 'Your tailored jacket pattern has been drafted and verified against anatomical shoulder slope specifications.',
            isCustomerVisible: true,
            photoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      {
        id: 'stg_2_fabric',
        stage: 'Fabric Selection',
        order: 2,
        status: 'Completed',
        progress: 100,
        startedAt: '2026-10-11T09:30:00Z',
        completedAt: '2026-10-11T14:00:00Z',
        estimatedDurationHours: 8,
        assignedArtisan: 'Eleanor Vance',
        artisanRole: 'Textile Archivist',
        customerSummary: '14oz Savile Worsted Wool inspected under studio lighting and cold-sponged to stabilize grain.',
        notes: [
          {
            id: 'n_03',
            timestamp: '2026-10-11T11:00:00Z',
            artisanName: 'Eleanor Vance',
            text: 'Bolt #W14-88 checked for dye uniformity across all 4.2 meters. Weft density matches 380 GSM requirement.',
            isCustomerVisible: false,
          },
          {
            id: 'n_04',
            timestamp: '2026-10-11T13:45:00Z',
            artisanName: 'Eleanor Vance',
            text: 'Premium worsted wool bolt prepared and rested before cutting.',
            isCustomerVisible: true,
          },
        ],
      },
      {
        id: 'stg_3_cutting',
        stage: 'Cutting',
        order: 3,
        status: 'Completed',
        progress: 100,
        startedAt: '2026-10-11T14:30:00Z',
        completedAt: '2026-10-12T08:00:00Z',
        estimatedDurationHours: 12,
        assignedArtisan: 'Henry Alcott',
        artisanRole: 'Senior Cloth Cutter',
        customerSummary: 'All individual garment panels precision cut with Savile Row inlay seam allowances.',
        notes: [
          {
            id: 'n_05',
            timestamp: '2026-10-11T16:00:00Z',
            artisanName: 'Henry Alcott',
            text: 'Cutting shears applied. Matched side seam stripes and pocket flap grain lines.',
            isCustomerVisible: true,
            photoUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
      {
        id: 'stg_4_sewing',
        stage: 'Sewing',
        order: 4,
        status: 'In Progress',
        progress: 60,
        startedAt: '2026-10-12T08:30:00Z',
        estimatedDurationHours: 36,
        assignedArtisan: 'Brigitte Moreau',
        artisanRole: 'Couture Tailor',
        customerSummary: 'Floating natural horsehair canvas is being hand-basted to the chest for anatomical roll and drape.',
        notes: [
          {
            id: 'n_06',
            timestamp: '2026-10-12T11:30:00Z',
            artisanName: 'Brigitte Moreau',
            text: 'Chest canvas pad-stitched with 800 hand stitches across lapel line for springy roll.',
            isCustomerVisible: true,
          },
          {
            id: 'n_07',
            timestamp: '2026-10-12T13:00:00Z',
            artisanName: 'Brigitte Moreau',
            text: 'Interior passport pocket welt joined; monogram "J.T." placement pre-marked in red tailor chalk.',
            isCustomerVisible: false,
          },
        ],
      },
      {
        id: 'stg_5_finishing',
        stage: 'Finishing',
        order: 5,
        status: 'Not Started',
        progress: 0,
        estimatedDurationHours: 14,
        assignedArtisan: 'Brigitte Moreau',
        artisanRole: 'Hand-Finisher',
        customerSummary: 'Smoked mother-of-pearl buttons and hand-worked milanese buttonholes will be hand-sewn.',
        notes: [],
      },
      {
        id: 'stg_6_qc',
        stage: 'Quality Control',
        order: 6,
        status: 'Not Started',
        progress: 0,
        estimatedDurationHours: 6,
        assignedArtisan: 'Master Daniel',
        artisanRole: 'Atelier QC Gatekeeper',
        customerSummary: 'Final atelier examination across 24 tailored tolerance criteria and hand pressing.',
        notes: [],
      },
      {
        id: 'stg_7_packaging',
        stage: 'Packaging',
        order: 7,
        status: 'Not Started',
        progress: 0,
        estimatedDurationHours: 4,
        assignedArtisan: 'Atelier Packaging Team',
        artisanRole: 'Heritage Packager',
        customerSummary: 'Placed in breathable cotton suit carrier with polished cedar wood hanger.',
        notes: [],
      },
      {
        id: 'stg_8_shipping',
        stage: 'Shipping',
        order: 8,
        status: 'Not Started',
        progress: 0,
        estimatedDurationHours: 2,
        assignedArtisan: 'Savile Row Logistics',
        artisanRole: 'White Glove Dispatcher',
        customerSummary: 'Scheduled for direct courier dispatch to Grosvenor Square, London.',
        notes: [],
      },
    ],
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-12T13:00:00Z',
  },
  {
    id: 'wf_002_dm_9481',
    orderId: 'ord_dm_9481',
    orderNumber: 'DM-2026-9481',
    customerName: 'Lord Alistair Sterling',
    customerEmail: 'a.sterling@kensington-holdings.co.uk',
    garmentName: 'Savile Row Deconstructed Worsted Coat',
    garmentCategory: 'outerwear',
    garmentThumbnail: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    currentStage: 'Pattern Design',
    overallProgress: 12,
    startedAt: '2026-10-12T06:00:00Z',
    estimatedFinishAt: '2026-10-26T18:00:00Z',
    isRushOrder: true,
    qualityScore: 100,
    customerVisibilityEnabled: true,
    stages: createDefaultStagesForGarment().map((stg) => {
      if (stg.stage === 'Pattern Design') {
        return {
          ...stg,
          status: 'In Progress' as const,
          progress: 40,
          startedAt: '2026-10-12T06:30:00Z',
          customerSummary: 'Your bespoke outerwear pattern is being drafted with Royal Ascot fitting specifications.',
          notes: [
            {
              id: 'n_10',
              timestamp: '2026-10-12T06:45:00Z',
              artisanName: 'Daniel’s Maison',
              text: 'Master pattern drafting underway. Accommodating Lord Alistair’s 1cm armhole ease preference.',
              isCustomerVisible: true,
            },
          ],
        };
      }
      return stg;
    }),
    createdAt: '2026-10-12T04:30:00Z',
    updatedAt: '2026-10-12T06:45:00Z',
  },
  {
    id: 'wf_003_dm_9482',
    orderId: 'ord_dm_9482',
    orderNumber: 'DM-2026-9482',
    customerName: 'Lady Vivienne Vance',
    customerEmail: 'vivienne.vance@vancemedia.com',
    garmentName: 'Raw-Hem Japanese Selvedge Denim Trousers',
    garmentCategory: 'trousers',
    garmentThumbnail: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    currentStage: 'Cutting',
    overallProgress: 32,
    startedAt: '2026-10-11T16:00:00Z',
    estimatedFinishAt: '2026-10-25T12:00:00Z',
    isRushOrder: false,
    qualityScore: 99.5,
    customerVisibilityEnabled: true,
    stages: createDefaultStagesForGarment().map((stg) => {
      if (stg.stage === 'Pattern Design') {
        return { ...stg, status: 'Completed' as const, progress: 100 };
      }
      if (stg.stage === 'Fabric Selection') {
        return { ...stg, status: 'Completed' as const, progress: 100 };
      }
      if (stg.stage === 'Cutting') {
        return {
          ...stg,
          status: 'In Progress' as const,
          progress: 50,
          startedAt: '2026-10-12T07:00:00Z',
          customerSummary: '15oz Kuroki indigo selvedge denim is being cut on the bias along outer leg selvedge lines.',
          notes: [
            {
              id: 'n_20',
              timestamp: '2026-10-12T08:00:00Z',
              artisanName: 'Henry Alcott',
              text: 'Shuttle-loom white/red selvedge edge aligned perfectly with outer leg seam.',
              isCustomerVisible: true,
            },
          ],
        };
      }
      return stg;
    }),
    createdAt: '2026-10-11T16:15:00Z',
    updatedAt: '2026-10-12T08:00:00Z',
  },
  {
    id: 'wf_004_dm_9478',
    orderId: 'ord_dm_9478',
    orderNumber: 'DM-2026-9478',
    customerName: 'Elena Rostova',
    customerEmail: 'e.rostova@atelier-rostova.com',
    garmentName: 'Monolithic Muslin Veil Ensemble',
    garmentCategory: 'gowns',
    garmentThumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    currentStage: 'Quality Control',
    overallProgress: 75,
    startedAt: '2026-10-08T09:00:00Z',
    estimatedFinishAt: '2026-10-18T17:00:00Z',
    isRushOrder: false,
    qualityScore: 99.9,
    customerVisibilityEnabled: true,
    stages: createDefaultStagesForGarment().map((stg) => {
      if (['Pattern Design', 'Fabric Selection', 'Cutting', 'Sewing', 'Finishing'].includes(stg.stage)) {
        return { ...stg, status: 'Completed' as const, progress: 100 };
      }
      if (stg.stage === 'Quality Control') {
        return {
          ...stg,
          status: 'In Progress' as const,
          progress: 80,
          startedAt: '2026-10-12T09:00:00Z',
          customerSummary: 'Atelier master inspecting draped muslin tension and corset boning alignment.',
          notes: [
            {
              id: 'n_30',
              timestamp: '2026-10-12T10:00:00Z',
              artisanName: 'Master Daniel',
              text: 'Bust and underbust boning tension passed 100% stiffness test. Underbust verified at 76cm.',
              isCustomerVisible: true,
            },
          ],
        };
      }
      return stg;
    }),
    createdAt: '2026-10-08T09:00:00Z',
    updatedAt: '2026-10-12T10:00:00Z',
  },
];

const STORAGE_KEY = 'daniels_production_workflows_v1';

class ProductionWorkflowStore {
  private workflows: OrderProductionWorkflow[];
  private activeWorkflowId: string;
  private listeners = new Set<() => void>();

  constructor() {
    this.workflows = this.loadInitial();
    this.activeWorkflowId = this.workflows[0]?.id || 'wf_001_dm_9480';
  }

  private loadInitial(): OrderProductionWorkflow[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load stored production workflows', e);
    }
    return INITIAL_PRODUCTION_WORKFLOWS;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.workflows));
    } catch (e) {
      console.warn('Could not persist production workflows', e);
    }
    this.listeners.forEach((fn) => fn());
  }

  public getWorkflows(): OrderProductionWorkflow[] {
    return this.workflows;
  }

  public getActiveWorkflow(): OrderProductionWorkflow {
    return (
      this.workflows.find((w) => w.id === this.activeWorkflowId) ||
      this.workflows[0] ||
      INITIAL_PRODUCTION_WORKFLOWS[0]
    );
  }

  public setActiveWorkflowId(id: string) {
    this.activeWorkflowId = id;
    this.listeners.forEach((fn) => fn());
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Recalculates overall progress percentage based on completed and in-progress stages.
   */
  private computeOverallProgress(stages: WorkflowStage[]): number {
    const totalWeight = stages.length * 100;
    const currentSum = stages.reduce((acc, stg) => {
      if (stg.status === 'Completed') return acc + 100;
      if (stg.status === 'In Progress') return acc + Math.max(10, stg.progress);
      return acc;
    }, 0);
    return Math.round((currentSum / totalWeight) * 100);
  }

  /**
   * Updates a specific stage's status, progress, artisan, or notes.
   */
  public updateStage(
    workflowId: string,
    stageName: ProductionStageName,
    updates: Partial<WorkflowStage>
  ) {
    this.workflows = this.workflows.map((wf) => {
      if (wf.id !== workflowId) return wf;

      const nextStages = wf.stages.map((stg) => {
        if (stg.stage !== stageName) return stg;
        const updated = { ...stg, ...updates };
        if (updates.status === 'Completed' && !updated.completedAt) {
          updated.completedAt = new Date().toISOString();
          updated.progress = 100;
        }
        if (updates.status === 'In Progress' && !updated.startedAt) {
          updated.startedAt = new Date().toISOString();
        }
        return updated;
      });

      const overallProgress = this.computeOverallProgress(nextStages);
      return {
        ...wf,
        currentStage: stageName,
        stages: nextStages,
        overallProgress,
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  /**
   * Advances the workflow to the next sequential stage.
   */
  public advanceToNextStage(
    workflowId: string,
    transitionNote?: string,
    isCustomerVisible: boolean = true
  ) {
    const targetWf = this.workflows.find((w) => w.id === workflowId);
    if (!targetWf) return;

    const currentIndex = STAGE_NAMES_IN_ORDER.indexOf(targetWf.currentStage);
    if (currentIndex >= STAGE_NAMES_IN_ORDER.length - 1) return; // Already at Shipping

    const currentStageName = STAGE_NAMES_IN_ORDER[currentIndex];
    const nextStageName = STAGE_NAMES_IN_ORDER[currentIndex + 1];

    this.workflows = this.workflows.map((wf) => {
      if (wf.id !== workflowId) return wf;

      const nextStages = wf.stages.map((stg) => {
        // Mark current as completed
        if (stg.stage === currentStageName) {
          const notes = transitionNote
            ? [
                ...stg.notes,
                {
                  id: `note_${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  artisanName: stg.assignedArtisan || 'Atelier Lead',
                  text: transitionNote,
                  isCustomerVisible,
                },
              ]
            : stg.notes;

          return {
            ...stg,
            status: 'Completed' as const,
            progress: 100,
            completedAt: new Date().toISOString(),
            notes,
          };
        }

        // Mark next stage as In Progress
        if (stg.stage === nextStageName) {
          return {
            ...stg,
            status: 'In Progress' as const,
            progress: Math.max(25, stg.progress),
            startedAt: new Date().toISOString(),
          };
        }

        return stg;
      });

      const overallProgress = this.computeOverallProgress(nextStages);

      return {
        ...wf,
        currentStage: nextStageName,
        stages: nextStages,
        overallProgress,
        updatedAt: new Date().toISOString(),
      };
    });

    this.persist();
  }

  /**
   * Adds an artisan craftsman note to a specific stage.
   */
  public addStageNote(
    workflowId: string,
    stageName: ProductionStageName,
    note: Omit<StageNote, 'id' | 'timestamp'>
  ) {
    const newNote: StageNote = {
      ...note,
      id: `note_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    this.workflows = this.workflows.map((wf) => {
      if (wf.id !== workflowId) return wf;
      return {
        ...wf,
        stages: wf.stages.map((stg) => {
          if (stg.stage !== stageName) return stg;
          return {
            ...stg,
            notes: [...stg.notes, newNote],
          };
        }),
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  /**
   * Toggles customer visibility on a specific note.
   */
  public toggleNoteVisibility(workflowId: string, stageName: ProductionStageName, noteId: string) {
    this.workflows = this.workflows.map((wf) => {
      if (wf.id !== workflowId) return wf;
      return {
        ...wf,
        stages: wf.stages.map((stg) => {
          if (stg.stage !== stageName) return stg;
          return {
            ...stg,
            notes: stg.notes.map((n) =>
              n.id === noteId ? { ...n, isCustomerVisible: !n.isCustomerVisible } : n
            ),
          };
        }),
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  /**
   * Toggles the master client tracking stream for the entire workflow.
   */
  public toggleMasterCustomerVisibility(workflowId: string) {
    this.workflows = this.workflows.map((wf) => {
      if (wf.id !== workflowId) return wf;
      return {
        ...wf,
        customerVisibilityEnabled: !wf.customerVisibilityEnabled,
        updatedAt: new Date().toISOString(),
      };
    });
    this.persist();
  }

  public resetToDefaults() {
    this.workflows = INITIAL_PRODUCTION_WORKFLOWS;
    this.activeWorkflowId = INITIAL_PRODUCTION_WORKFLOWS[0].id;
    this.persist();
  }
}

export const productionWorkflowStore = new ProductionWorkflowStore();

export function useProductionWorkflowStore() {
  const [workflows, setWorkflows] = useState<OrderProductionWorkflow[]>(
    productionWorkflowStore.getWorkflows()
  );
  const [activeWorkflow, setActiveWorkflow] = useState<OrderProductionWorkflow>(
    productionWorkflowStore.getActiveWorkflow()
  );

  useEffect(() => {
    const unsubscribe = productionWorkflowStore.subscribe(() => {
      setWorkflows(productionWorkflowStore.getWorkflows());
      setActiveWorkflow(productionWorkflowStore.getActiveWorkflow());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    workflows,
    activeWorkflow,
    setActiveWorkflowId: (id: string) => productionWorkflowStore.setActiveWorkflowId(id),
    updateStage: (
      wfId: string,
      stageName: ProductionStageName,
      updates: Partial<WorkflowStage>
    ) => productionWorkflowStore.updateStage(wfId, stageName, updates),
    advanceToNextStage: (
      wfId: string,
      notes?: string,
      isCustomerVisible: boolean = true
    ) => productionWorkflowStore.advanceToNextStage(wfId, notes, isCustomerVisible),
    addStageNote: (
      wfId: string,
      stageName: ProductionStageName,
      note: Omit<StageNote, 'id' | 'timestamp'>
    ) => productionWorkflowStore.addStageNote(wfId, stageName, note),
    toggleNoteVisibility: (
      wfId: string,
      stageName: ProductionStageName,
      noteId: string
    ) => productionWorkflowStore.toggleNoteVisibility(wfId, stageName, noteId),
    toggleMasterCustomerVisibility: (wfId: string) =>
      productionWorkflowStore.toggleMasterCustomerVisibility(wfId),
    resetToDefaults: () => productionWorkflowStore.resetToDefaults(),
  };
}
