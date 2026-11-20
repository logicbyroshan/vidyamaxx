import { describe, it, expect, beforeEach } from 'vitest';
import {
  extractApiList,
  setAuthToken,
  getAuthToken,
  setTenantHeaders,
  getTenantHeaders,
  clearSessionTokens,
} from '@vidyafloww/api';
import { useGlobalStore } from '../stores/globalStore';

describe('@vidyafloww/api shared helpers', () => {
  beforeEach(() => {
    clearSessionTokens();
  });

  it('unwraps Axios response envelopes cleanly (bare array, results, nested data)', () => {
    expect(extractApiList({ data: [{ id: 1 }] })).toEqual([{ id: 1 }]);
    expect(extractApiList({ data: { success: true, data: [{ id: 2 }] } })).toEqual([{ id: 2 }]);
    expect(extractApiList({ data: { success: true, results: [{ id: 3 }] } })).toEqual([{ id: 3 }]);
    expect(extractApiList(null)).toEqual([]);
    expect(extractApiList({ data: {} })).toEqual([]);
  });

  it('tracks access tokens and tenant headers cleanly and clears on logout', () => {
    expect(getAuthToken()).toBeNull();
    setAuthToken('jwt-access-123');
    setTenantHeaders('school-uuid-1', 'branch-uuid-2');
    expect(getAuthToken()).toBe('jwt-access-123');
    expect(getTenantHeaders()).toEqual({
      schoolId: 'school-uuid-1',
      branchId: 'branch-uuid-2',
    });

    clearSessionTokens();
    expect(getAuthToken()).toBeNull();
    expect(getTenantHeaders()).toEqual({ schoolId: null, branchId: null });
  });
});

describe('useGlobalStore RBAC & auth state', () => {
  beforeEach(() => {
    useGlobalStore.getState().clearAuthSession();
  });

  it('enforces division access for SCHOOL_ADMIN vs scoped STAFF', () => {
    const store = useGlobalStore.getState();
    store.setAuthSession({
      user: { id: 'u1', full_name: 'Principal', email: 'p@vf.in', phone: null, is_verified: true },
      activeMembership: {
        id: 'm1',
        user_type: 'SCHOOL_ADMIN',
        tenant_id: 't1',
        tenant_name: 'VidyaFloww Trust',
        school_id: 's1',
        school_name: 'DPS',
        school_code: 'DPS-01',
        default_branch_id: 'b1',
      },
      memberships: [],
      responsibilities: [],
    });
    expect(useGlobalStore.getState().hasDivisionAccess('fees_finance')).toBe(true);
    expect(useGlobalStore.getState().hasDivisionAccess('counselling_support')).toBe(true);

    // Switch to scoped STAFF with only transport responsibility
    store.setAuthSession({
      user: { id: 'u2', full_name: 'Teacher', email: 't@vf.in', phone: null, is_verified: true },
      activeMembership: {
        id: 'm2',
        user_type: 'STAFF',
        tenant_id: 't1',
        tenant_name: 'VidyaFloww Trust',
        school_id: 's1',
        school_name: 'DPS',
        school_code: 'DPS-01',
        default_branch_id: 'b1',
      },
      memberships: [],
      responsibilities: [{ id: 'r1', work_division: 'transport', actions: ['view', 'create', 'edit'] }],
    });
    expect(useGlobalStore.getState().hasDivisionAccess('transport')).toBe(true);
    expect(useGlobalStore.getState().hasDivisionAccess('counselling_support')).toBe(false);
  });
});
