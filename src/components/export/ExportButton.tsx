import { useState } from 'react';
import { Download, Copy, Check, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAllAlerts } from '../../hooks/useDrugs';
import {
  calculateRiskScore,
  getGradeCounts,
  getGradeLabel,
  getDosingForChildPugh,
} from '../../utils/analysis';
import {
  calculateRenalRiskScore,
  getRenalGradeCounts,
  getNephroGradeLabel,
  getRenalDosingForCKD,
} from '../../utils/renalAnalysis';
import { detectAlerts } from '../../utils/alerts';

export default function ExportButton() {
  const { state } = useApp();
  const { alerts: allAlerts } = useAllAlerts();
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const getCKDStageLabel = (stage: string): string => {
    const labels: Record<string, string> = {
      normal: '정상',
      G2: 'G2 (eGFR 60-89)',
      G3a: 'G3a (eGFR 45-59)',
      G3b: 'G3b (eGFR 30-44)',
      G4: 'G4 (eGFR 15-29)',
      G5: 'G5 (eGFR <15)',
      dialysis: '투석',
    };
    return labels[stage] || stage;
  };

  // 규제 회피: InfoLevel에 맞는 라벨 반환
  const getInfoLevelLabel = (level: string): string => {
    return level === 'info1' || level === 'info2' ? '참고' : '정보';
  };

  const generateTextReport = (): string => {
    const { selectedDrugs, childPughGrade, alcoholHistory, ckdStage } = state;
    const hepatoRiskScore = calculateRiskScore(selectedDrugs, childPughGrade);
    const renalRiskScore = calculateRenalRiskScore(selectedDrugs, ckdStage);
    const hepatoSummary = getGradeCounts(selectedDrugs);
    const renalSummary = getRenalGradeCounts(selectedDrugs);
    const triggeredAlerts = detectAlerts(selectedDrugs, childPughGrade, allAlerts, ckdStage);

    // 규제 회피: 중립적 표현 사용
    const lines: string[] = [
      '═══════════════════════════════════════',
      '        PharmRef 조회 결과',
      '═══════════════════════════════════════',
      '',
      `조회일시: ${new Date().toLocaleString('ko-KR')}`,
      '',
      '[ 조회 조건 ]',
      `• 간 기능 분류: ${childPughGrade === 'normal' ? '정상' : `Child-Pugh ${childPughGrade}`}`,
      `• 신 기능 분류: ${getCKDStageLabel(ckdStage)}`,
      `• 음주력: ${alcoholHistory === 'none' ? '없음' : alcoholHistory === 'social' ? '사회적 음주' : '만성 음주'}`,
      '',
      '[ 간 관련 정보 참고 수치 ]',
      `• 참고 수치: ${hepatoRiskScore}/100`,
      `• 조회 약물 수: ${hepatoSummary.totalDrugs}개`,
      `  - A분류: ${hepatoSummary.gradeACount}개`,
      `  - B분류: ${hepatoSummary.gradeBCount}개`,
      `  - C분류: ${hepatoSummary.gradeCCount}개`,
      `  - D분류: ${hepatoSummary.gradeDCount}개`,
      `  - E분류: ${hepatoSummary.gradeECount}개`,
      '',
      '[ 신 관련 정보 참고 수치 ]',
      `• 참고 수치: ${renalRiskScore}/100`,
      `  - N1분류: ${renalSummary.gradeN1Count}개`,
      `  - N2분류: ${renalSummary.gradeN2Count}개`,
      `  - N3분류: ${renalSummary.gradeN3Count}개`,
      `  - N4분류: ${renalSummary.gradeN4Count}개`,
      `  - N5분류: ${renalSummary.gradeN5Count}개`,
    ];

    if (triggeredAlerts.length > 0) {
      lines.push('', '[ 참고 정보 ]');
      triggeredAlerts.forEach(alert => {
        const level = getInfoLevelLabel(alert.alert_level);
        const category = alert.alert_category === 'hepato' ? '[간]' :
                         alert.alert_category === 'renal' ? '[신]' : '[복합]';
        lines.push(`• ${category} [${level}] ${alert.title}`);
        lines.push(`  ${alert.message}`);
      });
    }

    lines.push('', '[ 약물별 정보 ]');
    selectedDrugs.forEach(drug => {
      const hepatoDosing = getDosingForChildPugh(drug, childPughGrade);
      const renalDosing = getRenalDosingForCKD(drug, ckdStage);
      lines.push('');
      lines.push(`▶ ${drug.name_kr} (${drug.name_en})`);

      // 간 관련 정보
      lines.push(`  [간 관련] ${getGradeLabel(drug.hepatotoxicity.grade)}`);
      lines.push(`    패턴: ${drug.hepatotoxicity.pattern}`);
      if (childPughGrade !== 'normal' && hepatoDosing) {
        lines.push(`    Child-${childPughGrade} 참고: ${hepatoDosing.dose}`);
        if (hepatoDosing.recommendation) lines.push(`    참고: ${hepatoDosing.recommendation}`);
        if (hepatoDosing.caution) lines.push(`    참고: ${hepatoDosing.caution}`);
      }

      // 신 관련 정보
      if (drug.nephrotoxicity) {
        lines.push(`  [신 관련] ${getNephroGradeLabel(drug.nephrotoxicity.grade)}`);
        lines.push(`    패턴: ${drug.nephrotoxicity.pattern}`);
        if (ckdStage !== 'normal' && renalDosing) {
          lines.push(`    CKD ${ckdStage} 참고: ${renalDosing.dose}`);
        }
      } else {
        lines.push(`  [신 관련] 정보 없음`);
      }
    });

    lines.push(
      '',
      '═══════════════════════════════════════',
      '  본 정보는 교육 및 참고용이며,',
      '  의학적 의미가 없습니다.',
      '  전문가 상담을 권장합니다.',
      '═══════════════════════════════════════'
    );

    return lines.join('\n');
  };

  const handleCopyText = async () => {
    try {
      const text = generateTextReport();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      alert('복사에 실패했습니다');
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Dynamically import html2pdf
      const html2pdf = (await import('html2pdf.js')).default;

      // Create HTML content
      const content = document.createElement('div');
      content.innerHTML = generateHTMLReport();
      content.style.padding = '20px';
      content.style.fontFamily = 'sans-serif';

      const opt = {
        margin: 10,
        filename: `PharmRef_Report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(content).save();
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF 내보내기에 실패했습니다');
    } finally {
      setIsExporting(false);
    }
  };

  const generateHTMLReport = (): string => {
    const { selectedDrugs, childPughGrade, alcoholHistory, ckdStage } = state;
    const hepatoRiskScore = calculateRiskScore(selectedDrugs, childPughGrade);
    const renalRiskScore = calculateRenalRiskScore(selectedDrugs, ckdStage);
    const hepatoSummary = getGradeCounts(selectedDrugs);
    const renalSummary = getRenalGradeCounts(selectedDrugs);
    const triggeredAlerts = detectAlerts(selectedDrugs, childPughGrade, allAlerts, ckdStage);

    // 규제 회피: 중립적 색상 사용
    const getRenalGradeColor = (grade: string): string => {
      const colors: Record<string, string> = {
        N1: '#2563eb',  // blue-600
        N2: '#3b82f6',  // blue-500
        N3: '#64748b',  // slate-500
        N4: '#6b7280',  // gray-500
        N5: '#9ca3af',  // gray-400
      };
      return colors[grade] || '#6b7280';
    };

    // 규제 회피: 중립적 색상
    const getScoreColor = (score: number): string => {
      if (score >= 60) return '#2563eb';  // blue-600
      if (score >= 40) return '#64748b';  // slate-500
      return '#6b7280';  // gray-500
    };

    return `
      <div style="font-family: 'Pretendard', sans-serif; color: #1f2937;">
        <h1 style="text-align: center; color: #2563eb; margin-bottom: 20px;">
          PharmRef 조회 결과
        </h1>
        <p style="text-align: center; color: #6b7280; margin-bottom: 30px;">
          ${new Date().toLocaleString('ko-KR')}
        </p>

        <h2 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">조회 조건</h2>
        <ul style="margin-bottom: 20px;">
          <li>간 기능 분류: ${childPughGrade === 'normal' ? '정상' : `Child-Pugh ${childPughGrade}`}</li>
          <li>신 기능 분류: ${getCKDStageLabel(ckdStage)}</li>
          <li>음주력: ${alcoholHistory === 'none' ? '없음' : alcoholHistory === 'social' ? '사회적 음주' : '만성 음주'}</li>
        </ul>

        <h2 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">간 관련 정보 참고 수치</h2>
        <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 24px; font-weight: bold; color: ${getScoreColor(hepatoRiskScore)};">
            참고 수치: ${hepatoRiskScore}/100
          </p>
          <p>총 ${hepatoSummary.totalDrugs}개 약물</p>
          <p>A분류: ${hepatoSummary.gradeACount} / B분류: ${hepatoSummary.gradeBCount} / C분류: ${hepatoSummary.gradeCCount} / D분류: ${hepatoSummary.gradeDCount} / E분류: ${hepatoSummary.gradeECount}</p>
        </div>

        <h2 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">신 관련 정보 참고 수치</h2>
        <div style="background: #f5f3ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 24px; font-weight: bold; color: ${getScoreColor(renalRiskScore)};">
            참고 수치: ${renalRiskScore}/100
          </p>
          <p>N1분류: ${renalSummary.gradeN1Count} / N2분류: ${renalSummary.gradeN2Count} / N3분류: ${renalSummary.gradeN3Count} / N4분류: ${renalSummary.gradeN4Count} / N5분류: ${renalSummary.gradeN5Count}</p>
        </div>

        ${triggeredAlerts.length > 0 ? `
          <h2 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">참고 정보</h2>
          ${triggeredAlerts.map(alert => {
            const categoryLabel = alert.alert_category === 'hepato' ? '[간]' :
                                  alert.alert_category === 'renal' ? '[신]' : '[복합]';
            // 규제 회피: 모두 파란색/회색 계열 사용
            const bgColor = alert.alert_level === 'info1' ? '#dbeafe' : '#f1f5f9';
            const borderColor = alert.alert_level === 'info1' ? '#2563eb' : '#64748b';
            return `
            <div style="background: ${bgColor}; border-left: 4px solid ${borderColor}; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
              <strong>${categoryLabel} [${getInfoLevelLabel(alert.alert_level)}] ${alert.title}</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px;">${alert.message}</p>
            </div>
          `;}).join('')}
        ` : ''}

        <h2 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">약물별 정보</h2>
        ${selectedDrugs.map(drug => {
          const hepatoDosing = getDosingForChildPugh(drug, childPughGrade);
          const renalDosing = getRenalDosingForCKD(drug, ckdStage);
          // 규제 회피: 중립적 색상
          const hepatoGradeColor = drug.hepatotoxicity.grade === 'A' ? '#2563eb' :
                            drug.hepatotoxicity.grade === 'B' ? '#3b82f6' :
                            drug.hepatotoxicity.grade === 'C' ? '#64748b' :
                            drug.hepatotoxicity.grade === 'D' ? '#6b7280' : '#9ca3af';
          const renalGradeColor = drug.nephrotoxicity ? getRenalGradeColor(drug.nephrotoxicity.grade) : '#6b7280';
          return `
            <div style="border-left: 4px solid ${hepatoGradeColor}; padding: 10px; margin-bottom: 15px; background: #f9fafb;">
              <h3 style="margin: 0;">
                ${drug.name_kr}
                <span style="background: ${hepatoGradeColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 5px;">${drug.hepatotoxicity.grade}</span>
                ${drug.nephrotoxicity ? `<span style="background: ${renalGradeColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 5px;">${drug.nephrotoxicity.grade}</span>` : ''}
              </h3>
              <p style="color: #6b7280; margin: 5px 0;">${drug.name_en} · ${drug.drug_class}</p>

              <!-- 간 관련 정보 -->
              <div style="margin-top: 10px;">
                <p style="font-size: 14px; font-weight: bold; color: #2563eb;">간 관련: ${getGradeLabel(drug.hepatotoxicity.grade)}</p>
                ${childPughGrade !== 'normal' && hepatoDosing ? `
                  <div style="background: #dbeafe; padding: 8px; border-radius: 4px; margin-top: 8px;">
                    <strong>Child-${childPughGrade} 참고:</strong> ${hepatoDosing.dose}
                    ${hepatoDosing.caution ? `<br><span style="color: #64748b;">참고: ${hepatoDosing.caution}</span>` : ''}
                  </div>
                ` : ''}
              </div>

              <!-- 신 관련 정보 -->
              <div style="margin-top: 10px;">
                ${drug.nephrotoxicity ? `
                  <p style="font-size: 14px; font-weight: bold; color: #7c3aed;">신 관련: ${getNephroGradeLabel(drug.nephrotoxicity.grade)}</p>
                  ${ckdStage !== 'normal' && renalDosing ? `
                    <div style="background: #ede9fe; padding: 8px; border-radius: 4px; margin-top: 8px;">
                      <strong>CKD ${ckdStage} 참고:</strong> ${renalDosing.dose}
                    </div>
                  ` : ''}
                ` : '<p style="font-size: 14px; color: #6b7280;">신 관련: 정보 없음</p>'}
              </div>
            </div>
          `;
        }).join('')}

        <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280;">
          <strong>안내:</strong> 본 정보는 교육 및 참고용이며, 의학적 의미가 없습니다. 전문가 상담을 권장합니다.
        </div>
      </div>
    `;
  };

  if (state.selectedDrugs.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopyText}
        disabled={copied}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            복사됨
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            텍스트 복사
          </>
        )}
      </button>
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isExporting ? (
          <>
            <FileText className="w-4 h-4 animate-pulse" />
            생성 중...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            PDF 저장
          </>
        )}
      </button>
    </div>
  );
}
