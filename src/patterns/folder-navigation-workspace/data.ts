import type {
  NavigationFolder,
  NavigationFile,
} from "@/components/folder-navigation";
const file = (
  id: string,
  name: string,
  mb: number,
  description: string,
  tone?: NavigationFile["tone"],
): NavigationFile => ({
  id,
  name,
  kind: "file",
  bytes: mb * 1e6,
  description,
  tone,
});
const folder = (
  id: string,
  name: string,
  children: NavigationFolder["children"],
): NavigationFolder => ({ id, name, kind: "folder", children });
export const FIELDWORK = folder("fieldwork", "Fieldwork", [
  folder("clients", "Clients", [
    folder("maison", "Maison Olive", [
      folder("campaigns", "Campaigns", [
        folder("holiday", "Holiday 2026", [
          folder("selects", "Final selects", [
            file(
              "olv-0142",
              "OLV_H26_0142.jpg",
              24.1,
              "Hero composition, approved for the holiday campaign.",
              "olive",
            ),
            file(
              "olv-0157",
              "OLV_H26_0157.jpg",
              22.8,
              "Warm detail study for the seasonal collection.",
              "sand",
            ),
            file(
              "olv-0203",
              "OLV_H26_0203.jpg",
              26.3,
              "Studio still life, final color treatment.",
              "stone",
            ),
          ]),
          folder("retouching", "Retouching", [
            file(
              "retouch-notes",
              "Retouching notes.pdf",
              1.4,
              "Retouching notes and delivery checklist.",
            ),
          ]),
          folder("moodboard", "Moodboard", []),
        ]),
        folder("spring", "Spring 2026", [
          file(
            "spring-brief",
            "Creative brief.pdf",
            3.1,
            "Spring campaign direction and deliverables.",
          ),
        ]),
        folder("fall", "Fall 2025", []),
      ]),
      folder("brand", "Brand", [
        file(
          "brandbook",
          "Brand book.pdf",
          86,
          "Identity guidelines, logo usage and visual principles.",
        ),
        file(
          "logopack",
          "Logo pack.zip",
          1800,
          "A sample record for the approved brand asset package.",
        ),
        file(
          "typespec",
          "Type specimen.pdf",
          12,
          "Typography styles and editorial examples.",
        ),
      ]),
      folder("contracts", "Contracts", [
        file(
          "agreement",
          "Studio agreement.pdf",
          4.6,
          "Sample project agreement metadata. No real client documents are connected.",
        ),
      ]),
    ]),
    folder("halden", "Halden Coffee", [
      file(
        "roastery",
        "Roastery shoot.mp4",
        12900,
        "Sample record of the roastery film.",
      ),
      file("menu-board", "Menu board.pdf", 38, "Seasonal menu board layouts."),
      file(
        "coffee-logo",
        "Logo pack.zip",
        1300,
        "Identity asset package metadata.",
      ),
    ]),
    folder("northpoint", "Northpoint", []),
  ]),
  folder("internal", "Internal", [
    folder("operations", "Operations", []),
    folder("research", "Research", []),
    folder("archive", "Archive", []),
  ]),
  folder("templates", "Templates", [
    file(
      "brief-template",
      "Project brief.md",
      0.01,
      "A reusable project brief outline: context, audience, deliverables and timeline.",
    ),
  ]),
]);
