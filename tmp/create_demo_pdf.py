from pathlib import Path
import re
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A5
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "DEMO_SCRIPT.md").read_text(encoding="utf-8")
output = ROOT / "output" / "pdf" / "PathFinder_India_Demo_Script.pdf"
output.parent.mkdir(parents=True, exist_ok=True)

def clean(value: str) -> str:
    value = value.replace("\u2018", "'").replace("\u2019", "'")
    value = value.replace("\u201c", '"').replace("\u201d", '"')
    value = value.replace("\u2013", "-").replace("\u2014", "-")
    value = value.replace("&", "&amp;")
    value = re.sub(r"`([^`]*)`", r"<font name='Courier'>\1</font>", value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", value)
    return value

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitlePhone", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=18, leading=22, alignment=TA_CENTER, textColor=colors.HexColor("#12304A"), spaceAfter=8))
styles.add(ParagraphStyle(name="H1Phone", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=14, leading=17, textColor=colors.HexColor("#12304A"), spaceBefore=9, spaceAfter=5))
styles.add(ParagraphStyle(name="H2Phone", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=colors.HexColor("#0B6B57"), spaceBefore=7, spaceAfter=3))
styles.add(ParagraphStyle(name="BodyPhone", parent=styles["BodyText"], fontName="Helvetica", fontSize=9, leading=12, spaceAfter=4))
styles.add(ParagraphStyle(name="QuotePhone", parent=styles["BodyText"], fontName="Helvetica-Oblique", fontSize=9, leading=12, leftIndent=8, borderColor=colors.HexColor("#7AAE9A"), borderWidth=1, borderPadding=5, textColor=colors.HexColor("#24343B"), spaceAfter=6))
styles.add(ParagraphStyle(name="SmallPhone", parent=styles["BodyText"], fontName="Helvetica", fontSize=8, leading=10, textColor=colors.HexColor("#4B5B63"), spaceAfter=3))

story = []
for raw in source.splitlines():
    line = raw.strip()
    if not line:
        story.append(Spacer(1, 3))
    elif line.startswith("# "):
        story.append(Paragraph(clean(line[2:]), styles["TitlePhone"]))
    elif line.startswith("## "):
        story.append(Paragraph(clean(line[3:]), styles["H1Phone"]))
    elif line.startswith("### "):
        story.append(Paragraph(clean(line[4:]), styles["H2Phone"]))
    elif line.startswith("> "):
        story.append(Paragraph(clean(line[2:]), styles["QuotePhone"]))
    elif line.startswith("- "):
        story.append(Paragraph("&#8226; " + clean(line[2:]), styles["BodyPhone"]))
    elif re.match(r"^\d+\. ", line):
        story.append(Paragraph(clean(line), styles["BodyPhone"]))
    elif line.startswith("**"):
        story.append(Paragraph(clean(line), styles["SmallPhone"]))
    elif line.startswith("```"):
        continue
    else:
        story.append(Paragraph(clean(line), styles["BodyPhone"]))

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(colors.HexColor("#6B777D"))
    canvas.drawCentredString(A5[0] / 2, 9 * mm, f"PathFinder India | Demo script | Page {doc.page}")
    canvas.restoreState()

doc = SimpleDocTemplate(str(output), pagesize=A5, rightMargin=13 * mm, leftMargin=13 * mm, topMargin=12 * mm, bottomMargin=15 * mm, title="PathFinder India Hackathon Demo Script")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(output)
