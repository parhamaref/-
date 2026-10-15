/**
 * @file DesignerDashboardLayout.tsx
 * Enterprise Designer Dashboard Layout combining Header, Collapsible Sidebar, Mobile Drawer, and Router Switch.
 */

import React from 'react';
import { DesignerSidebar } from './DesignerSidebar';
import { DesignerHeader } from './DesignerHeader';
import { DesignerMobileDrawer } from './DesignerMobileDrawer';
import { DesignerSettingsView } from './DesignerSettingsView';
import { DesignerOverviewPlaceholder } from './DesignerOverviewPlaceholder';
import { DesignerSectionPlaceholder } from './DesignerSectionPlaceholder';
import { DesignerProfileView } from './profile/DesignerProfileView';
import { CustomizationBuilderWorkspace } from './customization/CustomizationBuilderWorkspace';
import { MeasurementConfigWorkspace } from './measurements/MeasurementConfigWorkspace';
import { OrderInboxView } from './orders/OrderInboxView';
import { ProductionWorkflowWorkspace } from './production/ProductionWorkflowWorkspace';
import { ProductionVideoWorkspace } from './video/ProductionVideoWorkspace';
import { CustomerCommunicationCenter } from './communication/CustomerCommunicationCenter';
import { InventorySupplierWorkspace } from './inventory/InventorySupplierWorkspace';
import { ReviewDashboard } from './reviews/ReviewDashboard';
import { AnalyticsCenter } from './analytics/AnalyticsCenter';
import { FinanceDashboard } from './finance/FinanceDashboard';
import { NotificationCenter } from './notifications/NotificationCenter';
import { SecuritySettingsWorkspace } from './security/SecuritySettingsWorkspace';
import { DesignerWardrobeWorkspace } from './wardrobe/DesignerWardrobeWorkspace';
import { DesignerAlterationWorkbench } from '../alterations/DesignerAlterationWorkbench';
import { DesignerDesignApprovalWorkbench } from '../designApproval/DesignerDesignApprovalWorkbench';
import { CollectionDashboard } from '../collections/CollectionDashboard';
import { DesignerVerificationWorkspace } from './verification/DesignerVerificationWorkspace';
import { QualityControlModule } from '../qc/QualityControlModule';
import { ReworkManagementWorkspace } from '../rework/ReworkManagementWorkspace';
import { AuditTrailWorkspace } from '../audit/AuditTrailWorkspace';
import { VersionControlWorkspace } from '../versionControl/VersionControlWorkspace';
import { ProtectedRoute } from './ProtectedRoute';
import { useDesignerStore } from '../../stores/designerStore';

export const DesignerDashboardLayout: React.FC<{ onNavigateHome?: () => void }> = ({ onNavigateHome }) => {
  const { activeSection } = useDesignerStore();

  const renderActiveSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DesignerOverviewPlaceholder />;

      case 'settings':
        return <DesignerSettingsView />;

      case 'profile':
        return <DesignerProfileView />;

      case 'products':
        return (
          <DesignerSectionPlaceholder
            sectionKey="products"
            title="Product & Silhouette Management"
            description="Create, edit, duplicate, archive, and manage multi-angle images and videos for independent designer collections."
            features={[
              'Multi-image drag-and-drop uploader with order reordering',
              'SKU generator and discount pricing configuration',
              'Fabric, color, and size variant assignment',
              'Production lead time specification per garment',
            ]}
          />
        );

      case 'collections':
        return <CollectionDashboard />;

      case 'customization':
        return <CustomizationBuilderWorkspace />;

      case 'measurements':
        return <MeasurementConfigWorkspace />;

      case 'orders':
        return <OrderInboxView />;

      case 'approvals':
        return <DesignerDesignApprovalWorkbench />;

      case 'versioning':
        return <VersionControlWorkspace />;

      case 'wardrobe':
        return <DesignerWardrobeWorkspace />;

      case 'alterations':
        return <DesignerAlterationWorkbench />;

      case 'production':
        return <ProductionWorkflowWorkspace />;

      case 'qc':
        return <QualityControlModule />;

      case 'rework':
        return <ReworkManagementWorkspace />;

      case 'videos':
        return <ProductionVideoWorkspace />;

      case 'messages':
        return <CustomerCommunicationCenter />;

      case 'inventory':
        return <InventorySupplierWorkspace initialTab="fabrics" />;

      case 'suppliers':
        return <InventorySupplierWorkspace initialTab="suppliers" />;

      case 'reviews':
        return <ReviewDashboard />;

      case 'analytics':
        return <AnalyticsCenter />;

      case 'earnings':
        return <FinanceDashboard />;

      case 'application':
        return <DesignerVerificationWorkspace />;

      case 'audit':
        return <AuditTrailWorkspace />;

      case 'notifications':
        return <NotificationCenter />;

      case 'media':
        return (
          <DesignerSectionPlaceholder
            sectionKey="media"
            title="Media & File Library"
            description="Centralized CDN asset manager for high-resolution photography, video clips, and technical lookbooks."
            features={[
              'Tag-based search and silhouette filtering',
              'Bulk media upload with automatic thumbnail generation',
              'Direct CDN URL clipboard copy',
              'Usage tracking across products and stories',
            ]}
          />
        );

      case 'security':
        return <SecuritySettingsWorkspace />;

      default:
        return <DesignerOverviewPlaceholder />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['Designer', 'Super Admin', 'Management', 'Partner']} onRedirectHome={onNavigateHome}>
      <div className="flex h-screen w-full bg-[#050505] text-[#E0E0E0] overflow-hidden select-none">
        {/* Desktop Collapsible Sidebar */}
        <DesignerSidebar onNavigateHome={onNavigateHome} />

        {/* Mobile Fullscreen Navigation Drawer */}
        <DesignerMobileDrawer onNavigateHome={onNavigateHome} />

        {/* Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header Bar */}
          <DesignerHeader onNavigateHome={onNavigateHome} />

          {/* Main Scrollable Stage */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#090909] to-[#050505]">
            {renderActiveSectionContent()}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};
