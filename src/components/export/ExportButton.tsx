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

  const generateTextReport = (): string => {
    const { selectedDrugs, childPughGrade, alcoholHistory, ckdStage } = state;
    const hepatoRiskScore = calculateRiskScore(selectedDrugs, childPughGrade);
    const renalRiskScore = calculateRenalRiskScore(selectedDrugs, ckdStage);
    const hepatoSummary = getGradeCounts(selectedDrugs);
    const renalSummary = getRenalGradeCounts(selectedDrugs);
    const triggeredAlerts = detectAlerts(selectedDrugs, childPughGrade, allAlerts, ckdStage);

    const lines: string[] = [
      '═══════════════════════════════════════',
      '    HepaTox/NephroTox Checker 분석 결과',
      '═══════════════════════════════════════',
      '',
      `분석일시: ${new Date().toLocaleString('ko-KR')}`,
      '',
      '[ 환자 정보 ]',
      `• 간기능 상태: ${childPughGrade === 'normal' ? '정상' : `Child-Pugh ${childPughGrade}`}`,
      `• 신기능 상태: ${getCKDStageLabel(ckdStage)}`,
      `• 음주력: ${alcoholHistory === 'none' ? '없음' : alcoholHistory === 'social' ? '사회적 음주' : '만성 음주'}`,
      '',
      '[ 간독성 위험도 요약 ]',
      `• 간독성 위험도 점수: ${hepatoRiskScore}/100`,
      `• 분석 약물 수: ${hepatoSummary.totalDrugs}개`,
      `  - A등급 (Well-known): ${hepatoSummary.gradeACount}개`,
      `  - B등급 (Highly likely): ${hepatoSummary.gradeBCount}개`,
      `  - C등급 (Probable): ${hepatoSummary.gradeCCount}개`,
      `  - D등급 (Possible): ${hepatoSummary.gradeDCount}개`,
      `  - E등급 (Unlikely): ${hepatoSummary.gradeECount}개`,
      '',
      '[ 신독성 위험도 요약 ]',
      `• 신독성 위험도 점수: ${renalRiskScore}/100`,
      `  - N1등급 (Well-known): ${renalSummary.gradeN1Count}개`,
      `  - N2등급 (Highly likely): ${renalSummary.gradeN2Count}개`,
      `  - N3등급 (Probable): ${renalSummary.gradeN3Count}개`,
      `  - N4등급 (Possible): ${renalSummary.gradeN4Count}개`,
      `  - N5등급 (Unlikely): ${renalSummary.gradeN5Count}개`,
    ];

    if (triggeredAlerts.length > 0) {
      lines.push('', '[ 경고 ]');
      triggeredAlerts.forEach(alert => {
        const level = alert.alert_level === 'critical' ? '위험' :
                      alert.alert_level === 'high' ? '주의' :
                      alert.alert_level === 'medium' ? '참고' : '정보';
        const category = alert.alert_category === 'hepato' ? '[간]' :
                         alert.alert_category === 'renal' ? '[신]' : '[복합]';
        lines.push(`• ${category} [${level}] ${alert.title}`);
        lines.push(`  ${alert.message}`);
      });
    }

    lines.push('', '[ 약물별 분석 ]');
    selectedDrugs.forEach(drug => {
      const hepatoDosing = getDosingForChildPugh(drug, childPughGrade);
      const renalDosing = getRenalDosingForCKD(drug, ckdStage);
      lines.push('');
      lines.push(`▶ ${drug.name_kr} (${drug.name_en})`);

      // 간독성 정보
      lines.push(`  [간독성] ${getGradeLabel(drug.hepatotoxicity.grade)}`);
      lines.push(`    패턴: ${drug.hepatotoxicity.pattern}`);
      if (childPughGrade !== 'normal' && hepatoDosing) {
        lines.push(`    Child-${childPughGrade} 권고: ${hepatoDosing.dose}`);
        if (hepatoDosing.recommendation) lines.push(`    권고: ${hepatoDosing.recommendation}`);
        if (hepatoDosing.caution) lines.push(`    주의: ${hepatoDosing.caution}`);
      }

      // 신독성 정보
      if (drug.nephrotoxicity) {
        lines.push(`  [신독성] ${getNephroGradeLabel(drug.nephrotoxicity.grade)}`);
        lines.push(`    패턴: ${drug.nephrotoxicity.pattern}`);
        if (ckdStage !== 'normal' && renalDosing) {
          lines.push(`    CKD ${ckdStage} 권고: ${renalDosing.dose}`);
        }
      } else {
        lines.push(`  [신독성] 정보 없음`);
      }
    });

    lines.push(
      '',
      '═══════════════════════════════════════',
      '  본 정보는 참고용이며, 최종 처방은',
      '  환자 상태에 따라 전문의 판단하에',
      '  결정되어야 합니다.',
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
        filename: `HepaTox_NephroTox_Report_${new Date().toISOString().split('T')[0]}.pdf`,
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

    const getRenalGradeColor = (grade: string): string => {
      const colors: Record<string, string> = {
        N1: '#dc2626',
        N2: '#ea580c',
        N3: '#ca8a04',
        N4: '#65a30d',
        N5: '#16a34a',
      };
      return colors[grade] || '#6b7280';
    };

    return `
      <div style="font-family: 'Pretendard', sans-serif; color: #1f2937;">
        <h1 style="text-align: center; color: #1e40af; margin-bottom: 20px;">
          HepaTox/NephroTox Checker 분석 결과
        </h1>
        <p style="text-align: center; color: #6b7280; margin-bottom: 30px;">
          ${new Date().toLocaleString('ko-KR')}
        </p>

        <h2 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">환자 정보</h2>
        <ul style="margin-bottom: 20px;">
          <li>간기능 상태: ${childPughGrade === 'normal' ? '정상' : `Child-Pugh ${childPughGrade}`}</li>
          <li>신기능 상태: ${getCKDStageLabel(ckdStage)}</li>
          <li>음주력: ${alcoholHistory === 'none' ? '없음' : alcoholHistory === 'social' ? '사회적 음주' : '만성 음주'}</li>
        </ul>

        <h2 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">간독성 위험도 요약</h2>
        <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 24px; font-weight: bold; color: ${hepatoRiskScore >= 60 ? '#dc2626' : hepatoRiskScore >= 40 ? '#ca8a04' : '#16a34a'};">
            간독성 위험도: ${hepatoRiskScore}/100
          </p>
          <p>총 ${hepatoSummary.totalDrugs}개 약물</p>
          <p>A등급: ${hepatoSummary.gradeACount} / B등급: ${hepatoSummary.gradeBCount} / C등급: ${hepatoSummary.gradeCCount} / D등급: ${hepatoSummary.gradeDCount} / E등급: ${hepatoSummary.gradeECount}</p>
        </div>

        <h2 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">신독성 위험도 요약</h2>
        <div style="background: #f5f3ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 24px; font-weight: bold; color: ${renalRiskScore >= 60 ? '#dc2626' : renalRiskScore >= 40 ? '#ca8a04' : '#16a34a'};">
            신독성 위험도: ${renalRiskScore}/100
          </p>
          <p>N1등급: ${renalSummary.gradeN1Count} / N2등급: ${renalSummary.gradeN2Count} / N3등급: ${renalSummary.gradeN3Count} / N4등급: ${renalSummary.gradeN4Count} / N5등급: ${renalSummary.gradeN5Count}</p>
        </div>

        ${triggeredAlerts.length > 0 ? `
          <h2 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">경고</h2>
          ${triggeredAlerts.map(alert => {
            const categoryLabel = alert.alert_category === 'hepato' ? '[간]' :
                                  alert.alert_category === 'renal' ? '[신]' : '[복합]';
            return `
            <div style="background: ${alert.alert_level === 'critical' ? '#fee2e2' : alert.alert_level === 'high' ? '#ffedd5' : '#fef9c3'}; border-left: 4px solid ${alert.alert_level === 'critical' ? '#dc2626' : alert.alert_level === 'high' ? '#ea580c' : '#ca8a04'}; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
              <strong>${categoryLabel} [${alert.alert_level === 'critical' ? '위험' : alert.alert_level === 'high' ? '주의' : '참고'}] ${alert.title}</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px;">${alert.message}</p>
            </div>
          `;}).join('')}
        ` : ''}

        <h2 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">약물별 분석</h2>
        ${selectedDrugs.map(drug => {
          const hepatoDosing = getDosingForChildPugh(drug, childPughGrade);
          const renalDosing = getRenalDosingForCKD(drug, ckdStage);
          const hepatoGradeColor = drug.hepatotoxicity.grade === 'A' ? '#dc2626' :
                            drug.hepatotoxicity.grade === 'B' ? '#ea580c' :
                            drug.hepatotoxicity.grade === 'C' ? '#ca8a04' :
                            drug.hepatotoxicity.grade === 'D' ? '#65a30d' : '#16a34a';
          const renalGradeColor = drug.nephrotoxicity ? getRenalGradeColor(drug.nephrotoxicity.grade) : '#6b7280';
          return `
            <div style="border-left: 4px solid ${hepatoGradeColor}; padding: 10px; margin-bottom: 15px; background: #f9fafb;">
              <h3 style="margin: 0;">
                ${drug.name_kr}
                <span style="background: ${hepatoGradeColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 5px;">${drug.hepatotoxicity.grade}</span>
                ${drug.nephrotoxicity ? `<span style="background: ${renalGradeColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 5px;">${drug.nephrotoxicity.grade}</span>` : ''}
              </h3>
              <p style="color: #6b7280; margin: 5px 0;">${drug.name_en} · ${drug.drug_class}</p>

              <!-- 간독성 정보 -->
              <div style="margin-top: 10px;">
                <p style="font-size: 14px; font-weight: bold; color: #1e40af;">간독성: ${getGradeLabel(drug.hepatotoxicity.grade)}</p>
                ${childPughGrade !== 'normal' && hepatoDosing ? `
                  <div style="background: #dbeafe; padding: 8px; border-radius: 4px; margin-top: 8px;">
                    <strong>Child-${childPughGrade} 권고:</strong> ${hepatoDosing.dose}
                    ${hepatoDosing.caution ? `<br><span style="color: #dc2626;">주의: ${hepatoDosing.caution}</span>` : ''}
                  </div>
                ` : ''}
              </div>

              <!-- 신독성 정보 -->
              <div style="margin-top: 10px;">
                ${drug.nephrotoxicity ? `
                  <p style="font-size: 14px; font-weight: bold; color: #7c3aed;">신독성: ${getNephroGradeLabel(drug.nephrotoxicity.grade)}</p>
                  ${ckdStage !== 'normal' && renalDosing ? `
                    <div style="background: #ede9fe; padding: 8px; border-radius: 4px; margin-top: 8px;">
                      <strong>CKD ${ckdStage} 권고:</strong> ${renalDosing.dose}
                    </div>
                  ` : ''}
                ` : '<p style="font-size: 14px; color: #6b7280;">신독성: 정보 없음</p>'}
              </div>
            </div>
          `;
        }).join('')}

        <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280;">
          <strong>면책조항:</strong> 본 정보는 참고용이며, 최종 처방은 환자 상태에 따라 전문의 판단하에 결정되어야 합니다.
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
