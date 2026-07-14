import { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import SubmissionReviewModal from '../../components/admin/SubmissionReviewModal';
import { fetchAllSubmissions } from '../../api/submissions';
import { formatDate } from '../../utils/formatDate';

const REVIEW_STATUS_CLASS = {
  Pending: 'status-badge-Submitted',
  Approved: 'status-badge-Approved',
  Rejected: 'status-badge-Rejected',
};

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [reviewTarget, setReviewTarget] = useState(null);

  const loadSubmissions = async () => {
    try {
      const { data } = await fetchAllSubmissions();
      setSubmissions(data);
    } catch {
      alert('Failed to load submissions');
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data } = await fetchAllSubmissions();
        if (active) {
          setSubmissions(data);
        }
      } catch {
        alert('Failed to load submissions');
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const pending = submissions.filter(
    (s) => s.reviewStatus === 'Pending'
  ).length;

  const approved = submissions.filter(
    (s) => s.reviewStatus === 'Approved'
  ).length;

  const rejected = submissions.filter(
    (s) => s.reviewStatus === 'Rejected'
  ).length;

  const thCls =
    'text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.7px] text-text-faint border-b border-border whitespace-nowrap';

  const tdCls =
    'px-5 py-4 border-b border-border align-middle';

  return (
    <div className="flex min-h-screen bg-bg-dark">
      <Sidebar />

      <main className="ml-60 flex-1 px-10 py-9">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-bold tracking-tight text-text-primary">
            Submissions
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            Review talent submissions and approve or reject them.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-7">
          {[
            {
              label: 'Total',
              value: submissions.length,
              color: 'text-text-primary',
            },
            {
              label: 'Pending',
              value: pending,
              color: 'text-info',
            },
            {
              label: 'Approved',
              value: approved,
              color: 'text-success',
            },
            {
              label: 'Rejected',
              value: rejected,
              color: 'text-danger',
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-bg-card border border-border rounded-xl px-6 py-5 flex flex-col gap-2 hover:border-border-light transition-colors"
            >
              <span className="text-[12px] font-medium text-text-muted uppercase tracking-[0.6px]">
                {label}
              </span>

              <span className={`text-[32px] font-bold tracking-tight ${color}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <h2 className="text-[16px] font-semibold text-text-primary">
              All Submissions
            </h2>

            <span className="text-[12px] text-text-faint bg-bg-input border border-border px-2.5 py-1 rounded-full">
              {submissions.length} total
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="py-16 text-center text-text-faint text-[15px]">
              No submissions yet — talents will submit here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-bg-surface">
                    <th className={thCls}>Task</th>
                    <th className={thCls}>Talent</th>
                    <th className={thCls}>Notes</th>
                    <th className={thCls}>Files</th>
                    <th className={thCls}>Submitted</th>
                    <th className={thCls}>Review Status</th>
                    <th className={thCls}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {submissions.map((sub) => (
                    <tr
                      key={sub._id}
                      className="border-b border-border last:border-0 hover:bg-bg-hover transition-colors"
                    >
                      {/* Task */}
                      <td className={`${tdCls} max-w-[180px]`}>
                        <span className="block font-medium text-text-primary truncate">
                          {sub.taskId?.title || '—'}
                        </span>
                      </td>

                      {/* Talent */}
                      <td className={`${tdCls} whitespace-nowrap`}>
                        <div className="flex items-center gap-2">
                          <div className="w-[26px] h-[26px] rounded-full avatar-talent flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                            {sub.talentId?.name?.[0] ?? '?'}
                          </div>

                          <span className="text-text-primary">
                            {sub.talentId?.name || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Notes */}
                      <td className={`${tdCls} max-w-[220px]`}>
                        <span className="block text-text-muted truncate text-[13px]">
                          {sub.notes || 'No notes'}
                        </span>
                      </td>

                      {/* Files */}
                      <td className={tdCls}>
                        {sub.fileUrls && sub.fileUrls.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {sub.fileUrls.map((url, index) => (
                              <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary text-[13px] hover:text-secondary underline underline-offset-2"
                              >
                                File {index + 1} ↗
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="text-text-faint italic">
                            No Files
                          </span>
                        )}
                      </td>

                      {/* Submitted */}
                      <td className={`${tdCls} text-[13px] text-text-muted whitespace-nowrap`}>
                        {formatDate(sub.createdAt, true)}
                      </td>

                      {/* Review Status */}
                      <td className={tdCls}>
                        <span
                          className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold ${
                            REVIEW_STATUS_CLASS[sub.reviewStatus] ||
                            'status-badge-Submitted'
                          }`}
                        >
                          {sub.reviewStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className={tdCls}>
                        <button
                          onClick={() => setReviewTarget(sub)}
                          className="px-3.5 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-lg text-[12px] font-semibold hover:bg-primary/20 transition-colors"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {reviewTarget && (
        <SubmissionReviewModal
          submission={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onReviewed={() => {
            setReviewTarget(null);
            loadSubmissions();
          }}
        />
      )}
    </div>
  );
};

export default SubmissionsPage;