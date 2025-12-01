import React, { useEffect, useState } from 'react';
import NodeModal from './components/NodeModal';
import { v4 } from 'uuid';
import Tree from 'react-d3-tree';
import { RawNodeDatum, TreeNodeDatum, CustomNodeElementProps } from 'react-d3-tree';

export function bfs(idParam: any, tree: RawNodeDatum | RawNodeDatum[], node: RawNodeDatum) {
  const id = String(idParam);
  const queue: RawNodeDatum[] = [];
  queue.unshift(tree as RawNodeDatum);
  while (queue.length > 0) {
    const curNode = queue.pop();
    if (String(curNode.attributes?.id) === id) {
      curNode.children.push(node);
      return { ...tree };
    }
    for (let i = 0; i < curNode.children.length; i++) {
      queue.unshift(curNode.children[i]);
    }
  }
}

export function renameNode(idParam: any, tree: RawNodeDatum | RawNodeDatum[], newName: string) {
  const id = String(idParam);
  const queue: RawNodeDatum[] = [];
  queue.unshift(tree as RawNodeDatum);
  while (queue.length > 0) {
    const curNode = queue.pop();
    if (String(curNode.attributes?.id) === id) {
      curNode.name = newName;
      return { ...tree };
    }
    for (let i = 0; i < curNode.children.length; i++) {
      queue.unshift(curNode.children[i]);
    }
  }
}

export function addSpouse(idParam: any, tree: RawNodeDatum | RawNodeDatum[], spouseName: string) {
  const id = String(idParam);
  const queue: RawNodeDatum[] = [];
  queue.unshift(tree as RawNodeDatum);
  while (queue.length > 0) {
    const curNode = queue.pop();
    if (String(curNode.attributes?.id) === id) {
      const attrs: any = curNode.attributes;
      if (attrs.spouseName && !attrs.spouseNames) {
        attrs.spouseNames = [attrs.spouseName];
        delete attrs.spouseName;
      }
      if (!attrs.spouseNames) attrs.spouseNames = [];
      attrs.spouseNames.push(spouseName);
      return { ...tree };
    }
    for (let i = 0; i < curNode.children.length; i++) queue.unshift(curNode.children[i]);
  }
}

export function removeSpouse(idParam: any, tree: RawNodeDatum | RawNodeDatum[], spouseName: string) {
  const id = String(idParam);
  const queue: RawNodeDatum[] = [];
  queue.unshift(tree as RawNodeDatum);
  while (queue.length) {
    const curNode = queue.pop();
    if (String(curNode.attributes?.id) === id) {
      const attrs: any = curNode.attributes;
      if (attrs.spouseNames && Array.isArray(attrs.spouseNames)) {
        attrs.spouseNames = attrs.spouseNames.filter((n: string) => n !== spouseName);
        return { ...tree };
      }
      if (attrs.spouseName === spouseName) {
        delete attrs.spouseName; // legacy single spouse removal
        return { ...tree };
      }
    }
    for (let i = 0; i < curNode.children.length; i++) queue.unshift(curNode.children[i]);
  }
}

export function deleteNode(idParam: any, tree: RawNodeDatum | RawNodeDatum[]) {
  const id = String(idParam);
  const root = tree as RawNodeDatum;
  if (String(root.attributes?.id) === id) return undefined;
  const queue: RawNodeDatum[] = [];
  queue.unshift(root);
  while (queue.length) {
    const cur = queue.pop();
    for (let i = 0; i < cur.children.length; i++) {
      const child = cur.children[i];
      if (String(child.attributes?.id) === id) {
        cur.children.splice(i, 1);
        return { ...tree };
      }
      queue.unshift(child);
    }
  }
  return undefined;
}

const LOCAL_KEY = 'family-tree-data-v1';

const App: React.FC = () => {
  const [tree, setTree] = useState<RawNodeDatum | RawNodeDatum[]>({
    name: 'Root',
    attributes: { id: 'root-1' },
    children: []
  });
  const [node, setNode] = useState<TreeNodeDatum | undefined>();
  const [zoom, setZoom] = useState<number>(1);
  const [translate, setTranslate] = useState<{ x: number, y: number }>({ x: 300, y: 100 });
  const treeContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [importError, setImportError] = useState<string>('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.name && parsed.children) {
          setTree(parsed);
        }
      }
    } catch (e) {
      // ignore malformed data
    }
  }, []);

  // Persist on tree change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(tree));
    } catch (e) {
      // storage may fail silently
    }
  }, [tree]);

  // Handle clicks from custom node rendering (TreeNodeDatum)
  const handleCustomNodeClick = (datum: TreeNodeDatum) => setNode(datum);
  // Handle clicks from react-d3-tree's onNodeClick (HierarchyPointNode)
  const handleTreeNodeClick = (hierarchyNode: any) => {
    if (hierarchyNode && hierarchyNode.data) setNode(hierarchyNode.data as TreeNodeDatum);
  };
  const close = () => setNode(undefined);

  const handleAddChild = (name: string) => {
    if (!node) return;
    const newTree = bfs(String(node.attributes?.id), tree, { name, attributes: { id: v4() }, children: [] });
    if (newTree) setTree(newTree);
    close();
  };
  const handleEditName = (newName: string) => {
    if (!node) return;
    const newTree = renameNode(String(node.attributes?.id), tree, newName);
    if (newTree) setTree(newTree);
    close();
  };
  const handleAddSpouse = (spouseName: string) => {
    if (!node) return;
    const newTree = addSpouse(String(node.attributes?.id), tree, spouseName);
    if (newTree) setTree(newTree);
    close();
  };
  const handleDeleteNode = () => {
    if (!node) return;
    const updated = deleteNode(String(node.attributes?.id), tree);
    if (updated) setTree(updated);
    close();
  };

  const handleRemoveSpouse = (spouseName: string) => {
    if (!node) return;
    const updated = removeSpouse(String(node.attributes?.id), tree, spouseName);
    if (updated) setTree(updated);
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(tree, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'family-tree.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(String(evt.target?.result));
        if (parsed && parsed.name && Array.isArray(parsed.children)) {
          setTree(parsed);
        } else {
          setImportError('Invalid tree schema');
        }
      } catch (err) {
        setImportError('Failed to parse JSON');
      }
    };
    reader.readAsText(file);
  };

  const resetZoom = () => setZoom(1);

  const renderCustomNode = (customProps: CustomNodeElementProps, click: (d: TreeNodeDatum) => void) => {
    const { nodeDatum } = customProps;
    const attrs: any = nodeDatum.attributes || {};
    const spouseNames: string[] = Array.isArray(attrs.spouseNames) ? attrs.spouseNames : attrs.spouseName ? [attrs.spouseName] : [];
    const baseY = 4;
    const mainFill = '#2D3748';
    const spouseFill = '#4A5568';
    return (
      <g className="group">
        <g onClick={() => click(nodeDatum)} style={{ cursor: 'pointer' }}>
          <defs>
            <linearGradient id={`grad-${attrs.id || nodeDatum.name}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3182CE" />
              <stop offset="100%" stopColor="#2C5282" />
            </linearGradient>
          </defs>
          <circle r={26} cx={0} fill={spouseNames.length ? 'url(#grad-' + (attrs.id || nodeDatum.name) + ')' : '#2B6CB0'} stroke="#CBD5E0" strokeWidth={2} className="transition group-hover:scale-105 group-active:scale-95 drop-shadow" />
          <text fill="#F7FAFC" fontSize={12} fontWeight={600} textAnchor="middle" x={0} y={baseY}>{nodeDatum.name}</text>
          {spouseNames.map((sn, i) => {
            const spacing = 70; const x = (i + 1) * spacing;
            return (
              <g key={i}>
                <circle r={24} cx={x} fill={spouseFill} stroke="#CBD5E0" strokeWidth={2} className="transition group-hover:scale-105 group-active:scale-95" />
                <text fill="#F7FAFC" fontSize={11} textAnchor="middle" x={x} y={baseY}>{sn}</text>
                <line x1={26} y1={0} x2={x - 24} y2={0} stroke="#718096" strokeWidth={3} className="opacity-80" />
              </g>
            );
          })}
        </g>
        {spouseNames.length > 0 && (
          <g transform={`translate(0,40)`}>
            <rect x={-38} y={-16} width={80 + spouseNames.length * 10} height={24} rx={12} fill="#2D3748" stroke="#4A5568" className="group-hover:stroke-brand-500 transition" />
            <text x={0} y={2} textAnchor="middle" fill="#E2E8F0" fontSize={11} className="font-medium">{spouseNames.length} spouse{spouseNames.length > 1 ? 's' : ''}</text>
          </g>
        )}
      </g>
    );
  };

  // Custom dark mode (replaces Chakra color mode)
  const [dark, setDark] = useState<boolean>(() => {
    try { return localStorage.getItem('dark-mode') === '1'; } catch { return false; }
  });
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark'); else root.classList.remove('dark');
    try { localStorage.setItem('dark-mode', dark ? '1' : '0'); } catch { }
  }, [dark]);
  const toggleDark = () => setDark(d => !d);

  return (
    <div className="flex flex-col gap-4 w-full h-screen p-3 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 transition-colors">
      <div className="flex flex-wrap items-center gap-3 rounded-md p-2 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
        <button onClick={downloadJSON} title="Download current tree JSON" className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white">
          <span>Export</span>
        </button>
        <button onClick={() => setTree({ name: 'Root', attributes: { id: v4() }, children: [] })} title="Start a new root" className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-md bg-green-600 hover:bg-green-500 text-white">
          <span>New</span>
        </button>
        <input type="file" accept="application/json" onChange={handleFileImport} title="Import tree JSON" className="file:mr-2 file:py-1 file:px-2 file:border file:rounded file:bg-slate-100 dark:file:bg-slate-700 file:text-xs hover:file:bg-slate-200 dark:hover:file:bg-slate-600 text-xs" />
        <div className="flex items-center gap-1">
          <button aria-label="Zoom in" title="Zoom in" onClick={() => setZoom(z => Math.min(z + 0.1, 3))} className="px-2 py-2 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs">+</button>
          <button aria-label="Zoom out" title="Zoom out" onClick={() => setZoom(z => Math.max(z - 0.1, 0.2))} className="px-2 py-2 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs">-</button>
          <button aria-label="Reset zoom" title="Reset zoom" onClick={resetZoom} className="px-2 py-2 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs">⟳</button>
          <button aria-label="Center tree" title="Center tree" onClick={() => {
            const rect = treeContainerRef.current?.getBoundingClientRect();
            if (rect) setTranslate({ x: rect.width / 2, y: 90 });
          }} className="px-2 py-2 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs">◎</button>
          <span className="px-2 py-1 text-[0.65rem] font-semibold rounded bg-purple-600 dark:bg-purple-500 text-white">{zoom.toFixed(2)}x</span>
        </div>
        <button aria-label="Toggle dark mode" title={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleDark} className="px-2 py-2 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs">
          {dark ? '☀️' : '🌙'}
        </button>
        {importError && <span className="text-xs text-red-600">{importError}</span>}
      </div>
      <div ref={treeContainerRef} className="flex-1 w-full border border-slate-300 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-slate-800 shadow-inner relative">
        <Tree
          data={tree as RawNodeDatum}
          zoomable={true}
          orientation="vertical"
          translate={translate}
          zoom={zoom}
          onNodeClick={handleTreeNodeClick}
          renderCustomNodeElement={(nodeInfo) => renderCustomNode(nodeInfo, handleCustomNodeClick)}
        />
        <NodeModal
          currentName={node?.name}
          existingSpouses={node && (node.attributes as any)?.spouseNames ? (node.attributes as any).spouseNames : []}
          onAddChild={handleAddChild}
          onEditName={handleEditName}
          onAddSpouse={handleAddSpouse}
          onRemoveSpouse={handleRemoveSpouse}
          onDelete={handleDeleteNode}
          canDelete={Boolean(node && (tree as RawNodeDatum).attributes?.id !== node.attributes?.id)}
          onClose={close}
          isOpen={Boolean(node)}
        />
      </div>
    </div>
  );
};

export default App;
